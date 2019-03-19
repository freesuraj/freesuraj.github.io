---
layout: post
title:  "Latest swift tips"
date:   2019-03-19 12:00:00
description: "Tips and tools for swift that may not be too popular"
tags: ios swift tips
---

### @autoclosure

`@autoclosure` attribute defines an argument that automatically gets wrapped in a closure. It's used to defer the execution of an expression to the site of use, rather than when the argument is passed.

Example:

{% splash %}

func evaluate(array: [String], emptyValue: @autoclosure () -> String) {
	if array.size > 0 {
		print("array size \(array.size)")
	} else {
		print(emptyValue())
	}
}

evaluate(["one", "two", "three"], "emptyArray") // array size 3
evaluate([], "blank") // blank


{% endsplash %}
