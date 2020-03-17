---
layout: post
title: "Structural Design Patterns in iOS"
date: 2020-03-17 13:00:00
description: "Design patterns in OOP ft. Swift"
tags: ios swift tips design patterns
---

<div class="cap"></div>

The wikipedia definition of a software design pattern is

> A reusable solution to a commonly occuring problem in the context of software design.

Gang of four book in 1994 formalised a number of design patterns. Here we are going to talk more specifically about the common design patterns when it comes to iOS app development. 

This is different from the architectural design patterns, MVC or MVVM or Viber or clean architecture. 

Structural design patterns are more about managing the piece of codes in reusable way.

Let's summarize them:

<!--more-->[ ](#){: id="more"}

## Adapter Factory Pattern

Solves the problem of creating an entire product families without specifying their concrete class type.

- Adaptor factor is a `protocol` that defines a method to get another `protocol`
- Concrete factory is a class or a value type that conforms to `protocol` and implements the method to return concrete class
- Client doesn't know about the concrete factory, and doesn't care.

## Factory Pattern

Solves the problem of creating product objects without specifying their class type. It defines a method which is used to create a new instance of a class, instead of using the designated initializer. The method can be overriden by subclass.

## Builder Pattern

Tries to simplify the complicated initializer of a class by breaking it down into multiple smaller building blocks (steps)

- Example: We can build a house with multiple options, with wall, with garage, with windows, with backyard, etc.
- Instead of putting those arguments in `house` init method, Builder pattern recommends to create additional steps (methods) to add those things.
- `House.init()`
- `house.buildWall`
- `house.buildGarage`
:
:

and so forth

## Iterator Pattern

Allows iteration over a complex sequential data by providing helper methods like `goToNext`, `traverse` etc.

## Prototype Pattern

Allows to clone objects without coupling to their specific classes. They usually have a method called `copy` or `clone`

## Singleton Pattern

When having only a single instance of a class is the requirement in the app, use Singleton pattern. It creates a single instance that will be accessed throught the app. For eg. Database client, Network Manager. Gotta be careful if multiple threads tries to access the singleton then we could run into race condition. Avoid if possible.

## Facade Pattern

Provides a simple interface on top of a complicated library/framework or a class.

## Delegation Pattern

Uses a delegate object to communicate or to get data. eg. UITableViewDelegate

## Observer Pattern

Creates an observer that will observe changes and notify the listener. Eg. NSNotification

## Strategy Pattern

Behavioural design pattern that turns sets of behaviours into objects (strategies) and make them interchangeable inside original context object.

## Mememto Pattern

Allows to save and restore to previous states (eg. undo in text editior) by saving the mementos (history) and without revealing implementation details.