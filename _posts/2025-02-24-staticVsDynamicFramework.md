---
layout: post
title: "Static vs Dynamic framework in Xcode"
date: 2025-02-22 11:46:00
description: "Why choose one over the other?"
tags: xcode static dynamic framework xcframework swift 
---

<div class="cap"></div>
Static vs Binary Framework in Xcode

Let’s dive into the key differences between **static frameworks** and **dynamic frameworks** in iOS, explore when to use each, and then tackle the curveball about performance trade-offs. This is particularly relevant when designing an SDK, like the Oracle Cloud Services SDK we’ve been discussing.

---

<!--more-->[ ](#){: id="more"}

### Key Differences Between Static and Dynamic Frameworks

#### 1. **Definition and Linking**
- **Static Framework**:
  - A static framework bundles a **static library** (`.a` file) with headers, resources, and metadata.
  - It’s linked at **compile time** into the app’s binary. The code becomes part of the app’s executable.
  - Result: A single, self-contained binary with no external dependencies at runtime for that framework.
- **Dynamic Framework**:
  - A dynamic framework bundles a **dynamic library** (`.dylib` or embedded framework binary) with headers, resources, and metadata.
  - It’s linked at **runtime** by the operating system. The framework remains a separate entity from the app’s main binary.
  - Result: The app loads the framework when needed, and it can be shared across processes.

#### 2. **File Structure**
- Both use the `.framework` bundle format (e.g., `MyFramework.framework`), but:
  - **Static**: Contains a static archive (`.a`) that’s resolved into the app binary during the build.
  - **Dynamic**: Contains a Mach-O binary that stays separate and is loaded dynamically.

#### 3. **Size and Distribution**
- **Static**:
  - Increases the app’s binary size because the framework’s code is embedded.
  - No separate framework file in the app bundle.
- **Dynamic**:
  - Keeps the app’s main binary smaller, but the framework is included as a separate file in the app bundle (under `Frameworks/`).
  - Supports **code sharing** across apps or app extensions if embedded in multiple targets.

#### 4. **Versioning and Updates**
- **Static**:
  - Locked to the version compiled into the app. Updates require recompiling and redistributing the app.
- **Dynamic**:
  - Can be updated independently of the app if hosted externally (e.g., via a system framework or app update), though iOS typically embeds dynamic frameworks in the app bundle, limiting this flexibility.

#### 5. **Code Signing and Security**
- **Static**: Fully integrated into the app’s signed binary, so no additional signing considerations.
- **Dynamic**: Must be separately signed and embedded in the app bundle, adhering to Apple’s code-signing requirements.

#### 6. **Swift and Objective-C Support**
- Both support Swift and Objective-C, but:
  - **Static**: Historically trickier with Swift due to runtime dependencies (Swift standard libraries). Xcode now handles this by embedding Swift runtime in the app.
  - **Dynamic**: Naturally aligns with Swift’s runtime model since the framework can bundle its own Swift runtime.

---

### When to Use Each

#### Use a Static Framework When:
1. **Small, Self-Contained Code**:
   - Example: A utility SDK (e.g., a lightweight logger or Core Data abstraction) where the code is unlikely to change frequently.
   - Reason: No runtime overhead, simpler distribution.
2. **Single App Usage**:
   - If the framework is only for one app (not shared across apps or extensions), static linking avoids the complexity of dynamic loading.
   - Example: An internal Oracle Cloud SDK feature specific to one app.
3. **Minimize Runtime Dependencies**:
   - Static frameworks ensure all code is bundled at build time, reducing risks of versioning mismatches or missing dependencies.
4. **Legacy Support**:
   - For older iOS versions (pre-iOS 8), static libraries were the norm since dynamic frameworks weren’t supported until iOS 8.

#### Use a Dynamic Framework When:
1. **Shared Across Targets**:
   - Example: An Oracle Cloud SDK used by an app and its extensions (e.g., Today widget, Watch app).
   - Reason: Dynamic frameworks can be embedded once and shared, reducing duplication.
2. **Large or Modular Codebase**:
   - If the SDK is large or has optional components, dynamic frameworks allow modular loading and updates.
   - Example: A comprehensive Oracle Cloud SDK with separate modules for authentication, resources, and analytics.
3. **Faster Build Times**:
   - Dynamic frameworks are compiled once and linked at runtime, speeding up incremental builds compared to recompiling static code into every target.
4. **App Store Flexibility**:
   - Apple prefers dynamic frameworks for modern iOS development (since Xcode 7), and they’re required for certain features like SwiftUI previews or on-demand resources (though less relevant for SDKs).

#### Practical Example (Oracle Cloud SDK):
- **Static**: If the SDK is a small, stable library (e.g., just authentication), embed it statically to simplify the app bundle.
- **Dynamic**: If the SDK includes multiple features (e.g., resource management, logging, UI components) shared across an app and its extensions, use a dynamic framework for modularity and reuse.

---

### Curveball: Performance Trade-Offs

Performance differences between static and dynamic frameworks stem from their linking and loading mechanics. Let’s break it down:

#### Static Framework Performance
- **Pros**:
  1. **Startup Time**: Faster app launch because the framework’s code is already part of the binary—no dynamic loading required.
     - The OS doesn’t need to resolve symbols or load a separate file at runtime.
  2. **Runtime Efficiency**: Slightly better execution speed since all code is inlined and optimized during compilation.
     - No indirection through dynamic linker tables.
  3. **Memory Usage**: Predictable memory footprint; no additional overhead for loading a separate module.
- **Cons**:
  1. **Build Time**: Slower incremental builds because the framework’s code must be recompiled and linked into the app binary every time.
  2. **Binary Size**: Larger app binary, which could slightly increase initial load time from disk (though this is negligible with modern SSDs and caching).
  3. **No Code Sharing**: If used in multiple targets (e.g., app and extension), the code is duplicated, increasing memory usage at runtime.

#### Dynamic Framework Performance
- **Pros**:
  1. **Build Time**: Faster incremental builds since the framework is compiled once and linked at runtime.
  2. **Memory Efficiency (Shared)**: If shared across processes (e.g., app and extension), the OS can load the framework into memory once and reuse it, reducing total memory usage.
  3. **Modularity**: Easier to swap or update without recompiling the entire app, though this is more about maintenance than runtime performance.
- **Cons**:
  1. **Startup Time**: Slower app launch due to dynamic linking overhead.
     - The dyld (dynamic linker) must locate, load, and resolve symbols for the framework at runtime, adding milliseconds to launch time (typically 10-50ms, depending on framework size).
  2. **Runtime Overhead**: Slight performance hit from dynamic dispatch.
     - Calls to framework methods go through a symbol table, which introduces a small indirection cost compared to static inlining.
  3. **Memory Overhead**: Additional memory used for the framework’s separate Mach-O binary and runtime metadata, even if not shared across targets.

#### Quantitative Example
- **Scenario**: An Oracle Cloud SDK with 100KB of code.
- **Static**:
  - App binary size: +100KB.
  - Launch time: ~5ms to load from disk (no linking).
  - Memory: 100KB embedded, no extra overhead.
- **Dynamic**:
  - App binary size: Minimal increase; 100KB in `Frameworks/`.
  - Launch time: ~15ms (5ms disk + 10ms linking).
  - Memory: 100KB + ~20KB for dyld metadata.

#### When Performance Matters Most
- **Static Wins**:
  - Latency-sensitive apps (e.g., games) where every millisecond of launch time counts.
  - Small SDKs where the linking overhead of dynamic frameworks outweighs benefits.
- **Dynamic Wins**:
  - Large apps with multiple targets where memory sharing reduces total footprint.
  - Development workflows prioritizing fast iteration over micro-optimized runtime.

---

### Final Thoughts
- **Static Frameworks**: Best for simplicity, performance-critical scenarios, and single-target apps. They shine when you want everything baked in with no runtime surprises.
- **Dynamic Frameworks**: Ideal for modularity, reuse across targets, and modern iOS development. They trade slight runtime costs for flexibility and build efficiency.

For an Oracle Cloud SDK:
- **Static**: Use for a lightweight, performance-focused version (e.g., just authentication).
- **Dynamic**: Use for a feature-rich SDK shared across an app ecosystem, accepting minor startup costs for scalability.

The performance trade-offs are subtle but measurable—choose based on your app’s priorities (launch speed vs. memory vs. build time)!