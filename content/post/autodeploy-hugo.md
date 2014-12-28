+++
date = "2014-12-23T18:11:23-08:00"
draft = false
title = "Auto deploy your Hugo blog to Parse"
tags = [ "code", "parse" ]
+++

I am very impressed by the current state of static website hosting tools.

Right now, I host this blog on [Parse.com](http://parse.com) using
Parse hosting (disclaimer - I work for Parse). I use [Hugo](http://gohugo.io/)
as my static website engine. Hugo is blazingly fast and simple to understand.
This time around I wanted my blog to be deployed automatically when I push
to Github.

I used [Travis-ci](https://Travis-ci.org/) for this. Travis is amazing and
deserves a shout out for making their software so usable and customizable.

It was not all plug and play, Parse.com does not have a deploy API to push
files and hence is not a deploy target on Travis.
The only way to deploy your site to Parse is via the cli. The issue is
Parse-cli requires you to type in your password - not possible in Travis, a
headless system.

So looking into the parse app, it has the following structure:
<script src="https://gist.github.com/sheki/70cf1db36c19e4db20cf.js"></script>

I added **public** and **config** to the gitignore so that they are never
checked
into the repository. Looking under the config directory, it has a JSON file with
the parse app-id and master key.
It looks like
<script src="https://gist.github.com/sheki/47b80580830ef42f51bd.js"></script>

I did not want to check in my actual **app-id** and **master key** to Github.
Luckily Travis had a solution for that. I set two secure environment variables
to the app-id and master-key using the
[encryption mechanism](http://docs.travis-ci.com/user/encryption-keys/)
provided by Travis.

I wrote a small go program to output the valid **config.json**
using these environment keys. This allowed me to secure my config keys in
Github but make them available in Travis.

The go program looks like
<script src="https://gist.github.com/sheki/62ca054981cd1457437f.js"></script>

The build script calls this program to generate the config and deploy the
generated site to Parse.

The complete build script is
<script src="https://gist.github.com/sheki/91c6cfab5d9cfc48d2ef.js"></script>

The whole working project is [here](https://github.com/sheki/parse-blog).

Using these bits and pieces of the cloud I have a blog system,
where I commit to github and it gets immediately deployed and hosted.

Note that you can use a similar approach to deploy your parse CloudCode to Parse
with just a github push.
