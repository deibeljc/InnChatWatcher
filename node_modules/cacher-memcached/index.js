var Memcached = require("memcached")

function CacherMemcached(host, opts) {
  if (host instanceof Memcached) {
    this.client = host
    return
  }
  host = host || "127.0.0.1:11211"
  opts = opts || {}
  //we want to default to a few more connections, 10 is much to small here
  opts.poolSize = opts.poolSize || 35

  this.client = new Memcached(host, opts)
}

CacherMemcached.prototype.get = function(key, cb) {
  this.client.get(key, cb)
}

CacherMemcached.prototype.set = function(key, cacheObject, ttl, cb) {
  cb = cb || function() {}
  this.client.set(key, cacheObject, ttl, cb)
}

CacherMemcached.prototype.invalidate = function(key, cb) {
  cb = cb || function() {}
  this.client.del(key, cb)
}

module.exports = CacherMemcached
