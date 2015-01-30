+++
date = "2015-01-25T20:49:52-08:00"
draft = true
title = "The document databases."

+++

Document databases or schema-less databases are the first choice for building
web and mobile apps nowadays. [MongoDB](https://mongodb.com) is a very good
example of a schema-less database if one is managing their own infrastructure.

Every cloud service provider has a document database option available as a service.
The advantage of these services are that you do not have to manage the instances
and replications. Most of these are automated for you

I looked at a few of these services and compared them on a few usability parameters.
The parameters are:

* **Query Model** -- what sort of queries does it support - SQL and JSON are the two popular options.
* **Indexes** -- are secondary indexes supported,
* **Object sizes/Limits** The biggest object you can store in it, and other limits.

The databases options are

* [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/)
* [Google Cloud Datastore](https://cloud.google.com/datastore/)
* [Parse](https://parse.com)
* [Amazon Dynamo DB](https://aws.amazon.com/dynamodb/)

The interesting thing about these database services is that all of them are
closed source and cannot be used independent of the cloud service.

Azure DocumentDB
----------------
* Supports full json docmuents without any schema.
* It has a powerful SQL based query model. [[1]] (http://azure.microsoft.com/en-us/documentation/articles/documentdb-sql-query/)
* You can manually add indexes to all fields.
* Maximum object size is 256KB. Good description of limits [here](http://azure.microsoft.com/en-us/documentation/articles/azure-subscription-service-limits/#documentdblimits).
* The service is in Beta and the total data size is limited to 10G if I understand the docs currently.

Google Cloud Datastore
----------------------
* It is practically schema less and you can add fields to without specifying it anywhere.
* It has a custom JSON based query language or has an almost SQL like GQL interface.
* Automatically adds indexes for all fields in an entity.
* developer has to define compound indexes (they call it a composite index).
* Their developer tool kit claims to suggest indexes if it encounters a query without an index. This is a unique and neat feature.
* has been around for a while, from right when google app engine launched.
* 1MB max object size, it is the largest allowed. 20,000 indexes per collection/entity.
* A hard to understand limit on compound index size "Maximum number of bytes in composite indexes for an entity". I think this could be made a bit clearer.
