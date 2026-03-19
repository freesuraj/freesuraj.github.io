---
layout: post
title: Strange Swift Protocol
description: "Swift protocol is very interesting yet very weird. Sometimes it behaves very strangely."
tags: swift protocol
date: 2016-01-24 13:12:11
---

<div class="cap"></div>

Swift protocol is very interesting yet very weird. Sometimes it behaves very strangely.

{% highlight swift %}
import Foundation

protocol Command {}

struct TLDRCommand: Command {}

// Works
func getOk() -> [Command] {
    return [TLDRCommand(), TLDRCommand(), TLDRCommand()]
}

// Does not work
func getFail() -> [Command] {
    let myArray = [TLDRCommand(), TLDRCommand(), TLDRCommand()]
    return myArray
}

// Casting also does not work
func getFail2() -> [Command] {
    let myArray = [TLDRCommand(), TLDRCommand(), TLDRCommand()]
    return myArray as [Command]
}

// This works, no complain about RHS not being the type of LHS
func getOk2() -> [Command] {
    let myArray: [Command] = [TLDRCommand(), TLDRCommand(), TLDRCommand()]
    return myArray
}

// And this also this works
func getOk3() -> [Command] {
    var myArray: [Command] = []
    myArray.append(TLDRCommand())
    myArray.append(TLDRCommand())

    return myArray
}
{% endhighlight %}
