+++
date = "2016-03-17T09:25:03-07:00"
draft = false
title = "Vim CtrlP per directory cache"
+++

I use the awesome [ctrlp](https://kien.github.io/ctrlp.vim/) in VIM.
At any given point of time I work in multiple directories (git projects).
This often pollutes my CtrlP MRU Cache.

For example - I get results for Api directory when I
am modifying code in my Web directory. This is midly irritating.  To solve this
you can set the **ctrlp_cache_dir** with a prefix of the current directory. Here is a snippet to do that.

<script src="https://gist.github.com/sheki/7b4180ae582572babde8.js"></script>
