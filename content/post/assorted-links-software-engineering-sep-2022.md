+++
title = "👨‍💻 Assorted links software engineering: September 2022"
Tags = ["software engineering"]
date = 2022-09-30T16:12:07-07:00
+++

1. **ULID** - Universally Unique Lexicographically Sortable Identifier ([link](https://github.com/ulid/spec))
   generate Unique IDs that are sortable. Similar to [Twitter snowflake](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake) without needing network access.

2. [Containers vs. Zones vs. Jails vs. VMs](https://blog.jessfraz.com/post/containers-zones-jails-vms/)
   - Jails are a BSD concept and are more locked down then containers.
   - Jails are a first class concept in BSD, containers are not a first class concept in Linux.
   - Containers use Linux primitives like cgroups and namespaces and are composable unlike Jails.
