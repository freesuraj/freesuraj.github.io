---
layout: post
title:  "Debug View for iOS App"
date:   2016-12-04 17:04:00
description: "An alternative option for System Root Settings"
tags: ios swift debug plist debugView
---

<div class="cap"></div>
It's a common requirement to tweak different configurations of the app for debug purposes. The general way of doing it is using Settings.bundle where the Settings are located inside `Setting` of the iPhone. It has a few drawbacks..

- Setting up Settings.bundle is a hassale and needs some research do to 
- Creating custom pages and changing values on the go are hard
- There are limitations to what values you can set
- It's just cubersome to go back to settings to see how app behavior changes when some configs are tweaked.

**In comes `PGDebugView` **

<!--more-->[ ](#){: id="more"}

<a href="https://raw.githubusercontent.com/freesuraj/PGDebugView/master/Resources/pgdebugview_gif.gif"><img src="https://raw.githubusercontent.com/freesuraj/PGDebugView/master/Resources/pgdebugview_gif.gif" class="img-responsive center-block img-thumbnail" width="400" /></a>
<figcaption>PGDebugView Screenshot</figcaption>

We are all well too familiar with `plist` file. It's often advisable to store a lot of configuration strings in a plist file. Tweaking a feature, or toggling it on or off becomes easier if they are put in a `plist` file. `PGDebugView` takes `plist` file as input and creates a plist viewer. You will be able to `modify` , `remove` or even `add new` configs right from your app, without ever leaving the app.

To trigger the debug view, simply call the following method:

```swift
// Debug.plist is the debug plist file
let plistPath = Bundle.main.path(forResource: "Debug", ofType: "plist")
let debugVC = PGDebugViewController(plistPath: path, readOnly: false)
```

That's it !!

It's simple enough to use and depending on your app architecture it could come in really handy if you need to tweak different config settings to test different features of your app.

[PGDebugView](https://github.com/freesuraj/PGDebugView) project is available in github as an open source project. 

