Node Pack
===

This is a simple skeleton for rapidly building a node.js application.

Docker
------

This now works with Docker, though you need to start Mongo as well.
```
docker run --name mongo -P -d -t relateiq/mongo
docker run --link mongo:db -v /var/code/nodepack/pack:/src -i -P -t morgante/nodepack
```