---
layout: post
title: Running Java from Shell
categories: [java, code]
tags: [java, code, setup]
fullview: true
---

Inside shell, you can’t directly run a command like this

      java -jar abc.jar

to run the .jar file.

shell doesn’t recognize the java command.

you need to export the environmental variable PATH of JAVA, normally it’s done by adding this line at the top

      export PATH = /home/usr/jdk_version/java/bin

then at the end of the java statement add $*

like ,

    java -jar abc.jar $*
