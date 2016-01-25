---
layout: post
title: Complex number
categories: [General]
tags: [General]
fullview: true
---

Complex number

~~~objective-c
struct Complex<T: SignedNumberType> {
    let real: T
    let imaginary: T
}
~~~

Since a complex number is comprised of a real and imaginary component, two complex numbers are equal if and only if their respective real and imaginary components are equal:

~~~objective-c
extension Complex: Equatable {}

// MARK: Equatable

func ==<T>(lhs: Complex<T>, rhs: Complex<T>) -> Bool {
    return lhs.real == rhs.real && lhs.imaginary == rhs.imaginary
}
~~~
