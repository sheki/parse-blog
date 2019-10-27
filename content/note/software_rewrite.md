+++
title = "Software Rewrites"
Tags = ["software", "rewrite"]
date = 2019-10-27T12:50:52-07:00
+++

## Rewrite dl.google.com in Go.

[Google rewrote the service that serves chrome and other downloads in Go.][1]

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

## Slack Rebuilds the deskop client

[Slack rebuilt their primary desktop app using React and a new multi team
architecture.][2]


**Goals**

Clients do not notice any different between clients. The interface is not
defined in a spec, but still exists.

* Still, software codebases have life spans
* Rewrite to get away from legacy technologies - jQuery and dom manipulation.
* New technology pardigm (React) came along which was a step function improvement.
* Older app assumed a single app within a single process, that assumption
  was no longer true as lot of people are signed into multiple slack teams
  at any given point of time.
* Create a “modern” section of the codebase that would be future-proof.
* Rebuild the app piece by piece, have a way to use modern pieces in the
  existing app, so that you can get feedback on a smaller surface area.
* Conventional wisdom states that rewrites are best avoided, but sometimes the benefits are too great to ignore.
* Much easy to new use new technology like Service workers from the new codebase.


[1]: https://talks.golang.org/2013/oscon-dl.slide#1
[2]: https://slack.engineering/rebuilding-slack-on-the-desktop-308d6fe94ae4
