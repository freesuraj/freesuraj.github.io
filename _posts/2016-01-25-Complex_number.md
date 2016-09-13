---
layout: post
title: Complex number
description: "Quick tips"
tags: swift complexNumber
date: 2016-01-25 14:25:44
---

Since a complex number is comprised of a real and imaginary component, two complex numbers are equal if and only if their respective real and imaginary components are equal.

<!--more-->[ ](#){: id="more"}

Complex number

**Complex.swift"**
{% highlight swift %}
struct Complex<T: SignedNumberType> {
    let real: T
    let imaginary: T
}
{% endhighlight %}

{% highlight swift %}
extension Complex: Equatable {}

// MARK: Equatable

func ==<T>(lhs: Complex<T>, rhs: Complex<T>) -> Bool {
    return lhs.real == rhs.real && lhs.imaginary == rhs.imaginary
}
{% endhighlight %}
