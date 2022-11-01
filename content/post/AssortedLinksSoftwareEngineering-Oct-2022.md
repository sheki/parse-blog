---
title: "Assorted Links Software Engineering Octobjer 2022"
date: 2022-10-31T14:14:40-07:00
draft: true
---

### Litestream ([link](https://www.youtube.com/watch?v=drgriZCRyrQ))

CMU Database talk about litestream, SQLite is all the rage nowadays, this talks explains that litestream still has a window of data loss (<1s). 
### Thin events vs Fat events ([link](https://codesimple.blog/2019/02/16/events-fat-or-thin/))

I think fat events help decoupling the system more but are harder to evolve. But in fat events each time a property definition needs changing, all existing clients have to be updated. 

### Diffuse complexity is exponentially worse than concentrated complexity  ([link](https://heuristics.substack.com/p/diffuse-complexity-is-exponentially))

Abstractions should do more and hide a lot of complexity away from the user.
