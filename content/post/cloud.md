+++
date = "2015-01-12T20:04:51-08:00"
draft = true
title = "Elasticity of the Cloud."

+++

All cloud services have a page where they boast about their top users.
If one was a developer, they might be tempted to believe that it is marketing and
it should not be factor in picking between cloud services.

That line of thinking is a little immature. To understand just chew on this pithy
statement for a while

> The cloud is as scalable as its largest customer.

The truth is nobody builds infinitely scalable data-centers. Software after all runs on
hardware, which has physical limits, sometimes limits like speed of light.

So what is a good measure for the elasticity/capacity of a cloud service?
It is their largest customer.
Netflix runs on AWS, so you won't likely run into problems
in video streaming as Netflix would have already hit those problems and
AWS would have fixed on them or is fixing right now.

A cloud service is usually pushed to limits by its biggest customer. But it is
symbiotic relationship, the big customer discovers flaws and good cloud providers
fix them. So the next time you are deciding a cloud service, look at the biggest
customers of a service, it will give you a measure of the elasticity of the said cloud.
