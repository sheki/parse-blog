+++
title = "Software Rewrites"
Tags = ["software", "rewrite"]
date = 2019-10-27T12:50:52-07:00
+++

## Rewrite dl.google.com in Go.

* Replace existing Cpp service with modern Go code.
* Rebuild the binary to meet existing unit tests
* Send traffic to both old and new services.
* Re-architect the system, collapse two different services into one.
* Advantages
   * cleaner maintainable code,
   * new service is faster as it can be concurrent and use more CPU cores.
   * It can use newer APIs of the dependent services -> e.g. file storage API

**Lessons**
* Don't lock yourself to a line by line rewrite.
* Try to keep improving the architecture.
