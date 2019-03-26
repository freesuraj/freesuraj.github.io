---
layout: post
title:  "Swift Race Condition: ATM Withdraw Problem"
date:   2019-03-26 12:00:00
description: "Example of race condition in swift, and how to avoid them"
tags: ios swift tips
---

<div class="cap"></div>
Race condition happens when 2 or more threads access the shared data at the same time and change its value at the same time resulting in unexpected state.

A simple example is the typical ATM withdraw problem. 

### ATM withdraw problem

Let's say we have our own bank account system and we have ATMs depoloyed all over the town to make withdrawl easy.

<!--more-->[ ](#){: id="more"}

{% highlight swift %}

class Account {
	var name: String
	var balance: Int = 0
	
	init(name: String) {
		self.name = name
	}
}


struct ATM {
	let tag: String
	init(_ tag: String) {
		self.tag = tag
	}

	func withdraw(_ account: Account, _ amount: Int) {} 
}


{% endhighlight %}

Let's write the implementation of the `withdraw(::)` function

{% highlight swift %}
func withdraw(_ account: Account, _ amount: Int) {
	print("Request to withdraw \(amount) from account with balance \(account.balance)")
	guard account.balance >= amount else {
		print("balanceNotEnough")
		return
	}
	print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
	// Sleeping for some random time, simulating a long process
	Thread.sleep(forTimeInterval: Double.random(in: 0...2))
	account.balance -= amount
	print("withdrawn: \(amount), remaining balance: \(account.balance)")
}
{% endhighlight %}

And let's try to withdraw money now:

{% highlight swift %}
let user = Account(name: "Adam")
user.balance = 1000

let atm1 = ATM("a")
let atm2 = ATM("b")

atm1.withdraw(user, 600)
atm2.withdraw(user, 500)
{% endhighlight %}

Since the user is withdrawing from atm1 first, then atm2, one after the other in sequence, the data is not being modified simultaneously by atm1 and atm2, so we have no problem. After withdrawing 600 first, the balance will be only 400. So it will not let the user withdraw 500. The output will look like this:

```
Request to withdraw 600 from account with balance 1000
balance 1000 enough ✅ to withdraw 600
withdrawn: 600, remaining balance: 400
Request to withdraw 500 from account with balance 400
balanceNotEnough
```

### Concurrent withdrawl

Now, let's imagine a hypothetical scenario where the user can withdraw money from two ATMs at the same time.

{% highlight swift %}

let queue = DispatchQueue(label: "atm", qos: .utility, attributes: [.concurrent])

queue.async { atm1.withdraw(user, 600) }
queue.async { atm2.withdraw(user, 500) }

{% endhighlight %}

The output will look like this:

```
Request to withdraw 600 from account with balance 1000
Request to withdraw 500 from account with balance 1000
balance 1000 enough ✅ to withdraw 600
balance 1000 enough ✅ to withdraw 500
withdrawn: 500, remaining balance: 500
withdrawn: 600, remaining balance: -100
```

The user is able to withdraw 1100 from his account where initial balance was only 1000. Did we just create 100 out of the thin year? 🤔

In fact what happened is a bad design in the `withdraw` function. We allow two threads to access the balance at the same time. When 500 is withdrawn first in the above output, the balance is 500. But the first thread to withdraw 600 has already checked the balance and seen it as 1000 which is enough to withdraw 600. So we ran into an undesired state, aka race condition.

### Solution:

**Solution 1: Double check**

A quick solution is to check again after the long process, just before withdrawing the balance to see if the balance had changed. 

{% highlight swift %}
func withdraw(_ account: Account, _ amount: Int) {
	print("Request to withdraw \(amount) from account with balance \(account.balance)")
	guard account.balance >= amount else {
		print("balanceNotEnough")
		return
	}
	print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
	// Sleeping for some random time, simulating a long process
	Thread.sleep(forTimeInterval: Double.random(in: 0...2))
	guard account.balance >= amount else {
		print("balanceNotEnough")
		return
	}
	account.balance -= amount
	print("withdrawn: \(amount), remaining balance: \(account.balance)")
}
{% endhighlight %} 

Here we check again just before deducting the balance (aka giving money to the user) to check the balance. This would work in this context, but it's not the optimal solution in all circumstances

**Solution 2: Sequential Queue**

By running the critical part of our code in sequential queue, i.e. the withdrawl can only be done one queue at a time, and in sequence, we can avoid the problem of resource sharing among threads.

{% highlight swift %}

static let serialQueue = DispatchQueue(label: "Serial Queue")

func withdraw(_ account: Account, _ amount: Int) {
	ATM.serialQueue.async {
		print("Request to withdraw \(amount) from account with balance \(account.balance)")
		guard account.balance >= amount else {
			print("balanceNotEnough")
			return
		}
		print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
		// Sleeping for some random time, simulating a long process
		Thread.sleep(forTimeInterval: Double.random(in: 0...2))
		account.balance -= amount
		print("withdrawn: \(amount), remaining balance: \(account.balance)")
	}
}

/// Output
Request to withdraw 600 from account with balance 1000
balance 1000 enough ✅ to withdraw 600
withdrawn: 600, remaining balance: 400
Request to withdraw 500 from account with balance 400
balanceNotEnough

{% endhighlight %}

**Solution 3: Concurrent Queue with Dispatch Barrier flag**

When dispatching a code block to a concurrent queue, you can assign a flag to it indicating that it is a barrier task, meaning that when it is time to execute this task, it should be the only executing item on the specified queue.

{% highlight swift %}

func withdraw(_ account: Account, _ amount: Int) {
	ATM.queue.async(flags: .barrier) {
		print("Request to withdraw \(amount) from account with balance \(account.balance)")
		guard account.balance >= amount else {
			print("balanceNotEnough")
			return
		}
		print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
		// Sleeping for some random time, simulating a long process
		Thread.sleep(forTimeInterval: Double.random(in: 0...2))
		account.balance -= amount
		print("withdrawn: \(amount), remaining balance: \(account.balance)")
	}
}

{% endhighlight %}

**Solution 4: NSLock**

It's the traditional way of synchronising a part of code. A lock can be accessed by any thread, but once the lock is acquired by a thread, all other threads are stopped from entering that piece of program until the lock is released. Important thing with NSLock is to identify the critical part of the code and add lock before it, and release the lock once that part is done with.

{% highlight swift %}

static let lock = NSLock()

func withdraw(_ account: Account, _ amount: Int) {
	ATM.lock.lock()
	print("Request to withdraw \(amount) from account with balance \(account.balance)")
	guard account.balance >= amount else {
		print("balanceNotEnough")
		return
	}
	print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
	// Sleeping for some random time, simulating a long process
	Thread.sleep(forTimeInterval: Double.random(in: 0...2))
	account.balance -= amount
	print("withdrawn: \(amount), remaining balance: \(account.balance)")
	ATM.lock.unlock()
}

{% endhighlight %}

When using locks, it's important to be careful to avoid a deadlock situation if two threads both acquiring locks are waiting on each other.

**Solution 5: Semaphore**

What's a semaphore?

Before answering that, let's answer what's lock, mutex and semaphore?

> A *lock* is a way to allow only one thread to enter a piece of code. A lock is not shared with any other processes that the thread shares resources with.

> A *mutex* is similar to lock, i.e. it is a lock to a shared resource, like database table, or criticial piece of code, but it can be shared across multiple processes.

> A *semaphore* is similar to mutex, but it can allow *x* number of threads to simultaneously access the resource.

In Swift's context, a *semaphore* is defined as `DispatchSemaphore(value: Int)`, here the `value` parameter determines how many threads can enter the resource at the same time. When the value is 1, it is essentially a mutex.

*That doesn't mean Mutex and Semaphore are same. Mutex means mutual exclusion. It's intended to force mutual exclusiveness for the shared resource, where is Semaphore is more for signaling. More explanation can be found [here](https://stackoverflow.com/questions/34519/what-is-a-semaphore/40238#40238)*

Back to our problem, if we want to solve the atm withdraw problem using Semaphore, we can only allow one thread to alter the account balance at one time.

{% highlight swift %}

static let semaphore = DispatchSemaphore(value: 1)
	
func withdraw(_ account: Account, _ amount: Int) {
	ATM.semaphore.wait()
	print("Request to withdraw \(amount) from account with balance \(account.balance)")
	guard account.balance >= amount else {
		print("balanceNotEnough")
		return
	}
	print("balance \(account.balance) enough ✅ to withdraw \(amount)" )
	// Sleeping for some random time, simulating a long process
	Thread.sleep(forTimeInterval: Double.random(in: 0...2))
	account.balance -= amount
	print("withdrawn: \(amount), remaining balance: \(account.balance)")
	ATM.semaphore.signal()
}

{% endhighlight %}

### Conclusion:

Regardless of the details of each of these solutions, the core idea remains the same, identify the critical section and make it accessible by only one thread at a time.

*Some parts of this article were influenced by [this post](https://medium.com/swiftcairo/avoiding-race-conditions-in-swift-9ccef0ec0b26).*