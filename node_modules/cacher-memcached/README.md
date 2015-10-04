# CacherMemcached
This is a pluggable backend for Cacher (https://github.com/addisonj/node-cacher)

## What is it?
A small adapter to use node-memcached as a store for Cacher

## Options
CacherMemcached takes the same parameters as node-memcached (https://github.com/3rd-Eden/node-memcached)

Additionally, it can take an existing memcached connection and resuse it:
```JavaScript
var memcached = require('memcached')(['host1', 'host2'], {retries: 100})
var Cacher = require('cacher')
var CacherMemcached = require('cacher-memcached')
var cacher = new Cacher(new CacherMemcached(memcached))
```

