---
layout: post
title:  "Latest swift tips"
date:   2019-03-19 12:00:00
description: "Tips and tools for swift that may not be too popular"
tags: ios swift tips
---

It's been a while I've updated my posts. Here are some new tips that makes coding with swift cool.

### @autoclosure

`@autoclosure` attribute defines an argument that automatically gets wrapped in a closure. It's used to defer the execution of an expression to the site of use, rather than when the argument is passed.

Example:

{% highlight swift %}

func evaluate(array: [String], emptyValue: @autoclosure () -> String) {
	if array.size > 0 {
		print("array size \(array.size)")
	} else {
		print(emptyValue())
	}
}

evaluate(["one", "two", "three"], "emptyArray") // array size 3
evaluate([], "blank") // blank


{% endhighlight %}

### Difference between `@escaping` and `nonescaping`

A `nonescaping` closure gets executed with the function's body and returns before the function returns.

From swift 3.x closures are `nonescaping` by default. Why? I think the reason is code optimisation by the copiler because if the compiler knows that the closure is `non-escaping`, it will take care of the memory allocation for the closure. 

We can use `self` without exclusively checking for its optionality `weak self` when in non-escaping context.


If the closure is expected to live past the body of the function, for eg. in async operations like fetching data from network calls and storing it, then make them `@escaping` and always make sure to check whether `self` is null or not by using `weak self`.

Lifecyle comparison:

@nonescaping lifecycle:

- pass the closure as func argument, during func call
- do some additional work with func
- func returns the closure
- func returs the compiler back

@escaping lifecycle:

- pass the closure as func argument
- do some additional work with func
- func execute the closure asynchronously or stored
- func returns the compiler back.


### Struct vs Class

**Struct and Enum** are `value` types, meaning, its value is copied when it's assigned to a varialbe or constant, or when it's passed to a function.

**Classes** are `reference` types, meaning, they are not copied when they are assigned to a variable or constant, or when they are passed to a function. Rather than a copy, a reference to the same existing instance is used.

Common:

- define properties to store values
- define methods to provide functionality
- define subscript to provide access to their values using subscripit syntax
- define initializers to set up their initial state
- be extended to expand their functionality beyond a default implementation i.e. `extension`
- conform to protocols to provide standard functionality of a certain kind

Classes have additional capabilities that structures don't have:

- inheritance
- type casting enables to check and interepret the type of a class instance during runtime
- deinitializers enable an instance of a class to free up any resources it has assigned
- reference counting


### `flatMap` vs `compactMap`

Both `flatMap` and `compactMap` map the items of array and produce a result array removing any `nil` values. 

But `flatMap`, like its name suggests, also flattens the result into one single array. 

{% highlight swift %}
let scoresByName = ["Henk": [0, 5, 8], "John": [2, 5, 8]]

let mapped = scoresByName.map { $0.value }
// [[0, 5, 8], [2, 5, 8]] - An array of arrays
print(mapped)

let flatMapped = scoresByName.flatMap { $0.value }
// [0, 5, 8, 2, 5, 8] - flattened to only one array
{% endhighlight %}

In fact, `s.flatMap(transform)` is equivalent to `Array(s.map(transform).joined())`.