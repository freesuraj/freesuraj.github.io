---
layout: post
title:  "A case for Plist and scripting in Swift"
date:   2016-11-20 19:54:00
description: "Why we should use Plist and how scripting in swift helps make life easy"
tags: ios swift script plist swift-script
---

<div class="cap"></div>
Property List is a convenient and flexible format for saving data. It was originally defined by apple, to use in iOS devices and later extended to various apps. Plist internally is actually an XML file and can easily be converted to JSON file format as well.
Xcode provides a nice visual tool to edit and view contents of a `.plist` file.

<!--more-->[ ](#){: id="more"}

<a href="/assets/img/infoPlist.png"><img src="/assets/img/infoPlist.png" class="img-responsive center-block img-thumbnail" width="400" height="200" /></a>
<figcaption>Typical Info.plist file</figcaption>

In the context of iOS, a plist file is used in many places. To store the basic information of an app, every target has a `info.plist` file which contains information like `bundle Id`, `product name`, `version no`, `background modes`, etc. If your app has a settings bundle, you save the information in `Root.plist` inside the bundle. So we can see Plist is a very popular format when it comes to iOS app development.

The best thing about it is, we can use `Plist` for storing other custom information. It's often a good practice to store various hard-coded key-value pairs in plist, for instance: API path name, screen toggle mode, app configuration, private tokens, etc. One thing, is if your plist file contains sensitive and private information, you should encrypt the file before shipping it out.

It's easy to edit and save information in a plist file, but let's talk about reading it from iOS app, because that's what we are more focused on. The ease of using plist file. Generally, we don't write to a plist file using `code`, but we must `read` from code.

Let's see the logic of reading a plist file:

#### Easy but not so safe approach

A plist can be converted into a Dictionary. If you know the key of a dictionary, you can get the value of it.

```swift
if let path = Bundle.main.path(forResource: "Debug", ofType: "plist"),
  let dict = NSDictionary(contentsOfFile: path) as? [String: Any] {
    ... // We have a dictionary now
}
```

Doesn't it seem very easy? Yes, it does. But, why is it unsafe? Let's imagine you have a plist whose JSON equivalent looks like this

```json
{
  key1: {
    key11: {
      key111: {
        keyFinal: "result"
      }
    }
  }
}
```

You'd need to know before hand, where your final value is. In this case `key1 -> key11 -> key111 -> keyFinal`. You need to check for validity and type guarantee at every key. Let's attempt to write, how we could read the final value `result`

```swift
// Assuming we already have dict from previous step
if let dict1 = dict["key1"] as? [String: Any],
  let dict2 = dict1["key11"] as? [String: Any],
  let dict3 = dict2["key111"] as? [String; Any],
  let finalValue = dict3["keyFinal"] as? String {
    ... // We have the final value "value" here now.
  }
```

Looks like the so-called easy step is not so easy after all. There must be a better way. There must be a safer way. Let's have another look.

#### Alternative approach

If we look carefully in the above code, the problem lies, because we need to keep digging for all intermediate `key`. We could probably write a generalized function that takes in all the keys, and it keeps going in to find the final value.

```swift
func valueFor(keys: String..., inDictionary dict: [String: Any]) -> Any? {

}
```

That helps! Can we do better? Writing key names one by one is too prone to mistakes. What if you have a typo.

What about, we generate the all possible keys combination out of plist, and read the key.

An interesting approach would be to generate a `enum` whose `case` are the `key` of the plist. This way we can be sure, we won't any unwarranted mistakes in providing the key name. There are several ways this could be done, the approach I would like to try out is write a script to generate the `enum` from Plist.

Since we are talking about iOS here, why not try scripting in `swift`. Swift is incredibly efficient for minimal tasks like this. There are several articles and talks about scripting in swift. You can checkout one of my talks [here](https://freesuraj.github.io/talks).

### Scripting in swift

Let's start the fun part now. To begin, create a new Xcode project (Commandline). You should see a `main.swift` with a default `Hello, World!` line. Go ahead try to build and run `Cmd+B` and `Cmd+R`. If it's running fine, we can go about doing the real deal.

The whole part can be divided into four main parts:
  * Read plist file from some [`input = .plist`]
  * Read all possible keys into a container
  * Generate a enum of keys, and a method to read plist using this enum key
  * Write the generated `.swift` file somewhere [`output = .swift`]

A plist is like an XML (and that's why a JSON like) file. It could be a dictionary or an array. So, before reading each items in plist, we should check whether it's an array or dictionary type.

Let's define a class named `PListEnum`. It is going to be the heart and soul of converting plist to swift enum.

```swift
class PlistEnum {
    let plistOutput: Any

    required init(url: URL) {
        plistOutput = File.readPlist(url: url)
    }
}
```

You provide the fileUrl of plist file, we have a helper method on class `File` that reads plist file.

```swift
class File {
  class func readPlist(url: URL) -> Any {
        if let dict = NSDictionary(contentsOf: url) as? [String: Any] {
            return dict
        } else if let array = NSArray(contentsOf: url) as? [Any] {
            return array
        } else {
            return []
        }
    }
}
```

#### Reading Array and Dictionary

Now that we've converted plist into either an `Array` of objects, or a `Dictionary` containing objects, we'd like to read all the possible keys inside them. For a dictionary, it's straight forward, it's a key-value pair. Possibile key type is only `String` and possible values are `Array`, `Number`, `Date`, `Boolean` or another `Dictionary`.
For an array, the only way to access all items is to know their index (`Int` type) in the array. If you know the index, accessing the value in an array is a very cheap(`O(n)`) operation.
So we have two possible `key` types if want to generalize both array and dictionary. `String` and `Int`.
Let's define a protocol named `Keypathable` and make `String` and `Int` conform to it.


```swift
protocol Keypathable {}
extension Int: Keypathable {}
extension String: Keypathable {}
```

Now we're going to loop through each item of the dictionary and array in plist, as we loop through we save the combination of keys in an array. To hold the combination of keys that produces a value, we define a `struct` called `PlistKey`

```swift
struct PlistKey: CustomStringConvertible {
        let keys: [Keypathable]

        func keyByAppending(_ key: Keypathable) -> PlistKey {
            var myKeys = keys
            myKeys.append(key)
            return PlistKey(keys: myKeys)
        }

        var keyCase: String {
            var keyArray: [String] = []
            for k in keys {
                keyArray.append("\(k)")
            }
            return keyArray.joined(separator: "_")
        }

        var description: String {
            return keys.description
        }

    }
```

We also define a couple of helper methods that we would find helpful later.

Let's write a method that loops through dictionary and array.

```swift
func run() {
        var keys: [PlistKey] = []
        // Reads a dictionary
        func checkDict(_ dictionary: [String: Any], plistKey: PlistKey) {
            for (key, value) in dictionary {
                if let array = value as? [Any] {
                    checkArray(array, plistKey: plistKey.keyByAppending(key))
                } else if let dict = value as? [String: Any] {
                    checkDict(dict, plistKey: plistKey.keyByAppending(key))
                } else {
                    keys.append(plistKey.keyByAppending(key))
                }
            }
        }

        // Reads an array
        func checkArray(_ array: [Any], plistKey: PlistKey) {
            for (index, value) in array.enumerated() {
                if let array = value as? [Any] {
                    checkArray(array, plistKey: plistKey.keyByAppending(index))
                } else if let dict = value as? [String: Any] {
                    checkDict(dict, plistKey: plistKey.keyByAppending(index))
                } else {
                    keys.append(plistKey.keyByAppending(index))
                }
            }
        }

        if let output = plistOutput as? [String: Any] {
            checkDict(output, plistKey: PlistKey(keys: []))
        } else if let output = plistOutput as? [Any] {
            checkArray(output, plistKey: PlistKey(keys: []))
        }
}
```

We've two methods defined inside `run`. `checkDict` and `checkArray` are very similar, the only difference is one has `String` key path type and the other has `Int` key path type.

Once this finishes, the variable `keys` contains combination of all possible key paths that result in a meaningful value. All we are left with now, is to write a `.swift` file with `enum cases`

The final config file we'd like to generate would look something like this:
Let's call it `PlistConfig.swift`

```swift

import Foundation

protocol PathType {}
extension Int: PathType {}
extension String: PathType {}


public enum PKeys {
  //***************
	 case key1_0
   case key2_key21
//***************
	var keys: [PathType] {
	 switch self {
     //***************
		 case .key1_0: return ["key1", 0]
     case .key2_key21: return ["key2", "key21"]
     //***************
		 }
	 }

}


class PlistConfig {

	 let plistOutput: Any

	 private init() {
		 if let url = Bundle.main.url(forResource: "example", withExtension: "plist") {
			 if let dict = NSDictionary(contentsOf: url) as? [String: Any] {
				 plistOutput = dict
			 } else if let array = NSArray(contentsOf: url) as? [Any] {
				 plistOutput = array
			 } else {
				 plistOutput = []
			 }
		 } else {
			 plistOutput = []
		 }
	 }


	 func valueFor(_ keyPath: [PathType]) -> Any? {
		 let count = keyPath.count
		 var finalValue: Any? = plistOutput
		 for i in 0..<count {
			 let path = keyPath[i]
			 if let dictPath = path as? String {
				 if let newValue = finalValue as? [String: Any] {
					 finalValue = newValue[dictPath]
				 } else {
					 return nil
				 }
			 } else if let arrayPath = path as? Int {
				 if let newValue = finalValue as? [Any], arrayPath < newValue.count {
					 finalValue = newValue[arrayPath]
				 } else {
					 return nil
				 }
			 }
		 }
		 return finalValue
		 }

}

```

The part commented between two `//*************** ` indicates the part that needs to be updated from our script. Other than that, `PlistConfig.swift` is pretty ready to be used.

The implementation part of the final part is a little bit long, so please bear with me.

```swift
let template: String = "\n" +
    "import Foundation\n" +
    "\n" +
    "protocol PathType {}\n" +
    "extension Int: PathType {}\n" +
    "extension String: PathType {}\n" +
    "\n" +
    "\n" +
    "public enum PKeys {\n" +
        "{CASES}\n" +
    "\n" +
        "\tvar keys: [PathType] {\n" +
            "\t switch self {\n" +
            "{CASESRESULTS}\n" +
            "\t\t }\n" +
        "\t }\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "class PlistConfig {\n" +
    "\n" +
    "\t let plistOutput: Any\n" +
    "\n" +
    "\t private init() {\n" +
            "\t\t if let url = Bundle.main.url(forResource: \"{FILENAME}\", withExtension: \"plist\") {\n" +
                "\t\t\t if let dict = NSDictionary(contentsOf: url) as? [String: Any] {\n" +
                    "\t\t\t\t plistOutput = dict\n" +
                "\t\t\t } else if let array = NSArray(contentsOf: url) as? [Any] {\n" +
                    "\t\t\t\t plistOutput = array\n" +
                "\t\t\t } else {\n" +
                    "\t\t\t\t plistOutput = []\n" +
                "\t\t\t }\n" +
            "\t\t } else {\n" +
                "\t\t\t plistOutput = []\n" +
            "\t\t }\n" +
        "\t }\n" +
    "\n" +
    "\n" +
        "\t func valueFor(_ keyPath: [PathType]) -> Any? {\n" +
            "\t\t let count = keyPath.count\n" +
            "\t\t var finalValue: Any? = plistOutput\n" +
            "\t\t for i in 0..<count {\n" +
            "\t\t\t let path = keyPath[i]\n" +
            "\t\t\t if let dictPath = path as? String {\n" +
                "\t\t\t\t if let newValue = finalValue as? [String: Any] {\n" +
                    "\t\t\t\t\t finalValue = newValue[dictPath]\n" +
                "\t\t\t\t } else {\n" +
                    "\t\t\t\t\t return nil\n" +
                "\t\t\t\t }\n" +
            "\t\t\t } else if let arrayPath = path as? Int {\n" +
                "\t\t\t\t if let newValue = finalValue as? [Any], arrayPath < newValue.count {\n" +
                    "\t\t\t\t\t finalValue = newValue[arrayPath]\n" +
                "\t\t\t\t } else {\n" +
                    "\t\t\t\t\t return nil\n" +
                "\t\t\t\t }\n" +
            "\t\t\t }\n" +
        "\t\t }\n" +
            "\t\t return finalValue\n" +
        "\t\t }\n" +
        "\n" +
"}\n" +
"\n"

```

This defines the template. We'd replace a few parameters inside it, and write this `template` string into a file named `PlistConfig.swift`.
The final part is rather straight forward:

```swift
var cases: [String] = []
        var caseResult: [String] = []
        for plistKey in keys {
            cases.append("\t case \(plistKey.keyCase)")
            caseResult.append("\t\t case .\(plistKey.keyCase): return \(plistKey.keys)")
        }
        let content = template.replacingOccurrences(of: "{FILENAME}", with: file)
        let contentCases = content.replacingOccurrences(of: "{CASES}", with: cases.joined(separator: "\n"))
        let finalContent = contentCases.replacingOccurrences(of: "{CASESRESULTS}", with: caseResult.joined(separator: "\n"))
        let output = Bundle.main.bundlePath
        let _ = File.write(path: output + "/PListConfig.swift", content: finalContent )
```

Like the previously defined `read` method, we have a `write method` on `File` class.

```swift
class func write (path: String, content: String, encoding: String.Encoding = String.Encoding.utf8) -> Bool {
    return ((try? content.write(toFile: path, atomically: true, encoding: encoding)) != nil) ?true :false
}
```

That's it for generating the script.

The next part would be, to make sure plist file and `PlistConfig.swift` are always in sync. Ideally, we'd like to protect `PlistConfig.swift` as readonly for user. And for iOS Project, we could write a Pre-build script to check if there's any update on plist file, and if so, to update the `PlistConfig.swift` file.

I might write my next post on that topic.

Till then, good day!!
