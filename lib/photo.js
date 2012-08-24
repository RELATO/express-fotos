var redis = require('redis')
    , db = redis.createClient();

module.exports = Photo;

function Photo(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

function slug(str) {
    console.log("we're in slug()");
    return str
    .replace(/ +/g, '-')
    .replace(/[^a-zA-Z_0-9-]/g, '')
    .toLowerCase();
}

Photo.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    }
    else {
        var self = this;
        this.slug = slug(this.name);
        console.log("about to incr");
        db.incr('photo:ids', function(err, id) {
            console.log("id: " + id);
            if (err) return fn(err);
            self.id = id;
            db.zadd('user:' + self.user + ':photos', id, id);
            db.zadd('photos', id, id);
            self.update(fn);
        });
    }
};

Photo.prototype.update = function(fn) {
    db.set('photo:id:' + this.slug, this.id);
    db.hmset('photo:' + this.id, this, fn);
};

Photo.prototype.remove = function(fn) {
    db.multi()
    .del('photo:id:' + this.slug)
    .del('photo:' + this.id)
    .zrem('user:' + this.user + ':photos', this.id)
    .zrem('photos', this.id)
    .exec(fn);
};

Photo.get = function(id, fn) {
    db.hgetall('photo:' + id, function(err, photo) {
        if (err) return fn(err);
        fn(null, new Photo(photo));
    });
};

// inclusive
Photo.getRange = function(from, to, fn) {
    db.zrange('photos', from, to, function(err, ids) {
        if (err) return fn(err);
        var pending = ids.length
            , photos = []
            , done;

        if (!pending) return fn(null, []);

        ids.forEach(function(id) {
            Photo.get(id, function(err, photo) {
            
                if (done) return;
                
                if (err) {
                    done = true;
                    return fn(err);
                }
                
                photos.push(photo);
                --pending || fn(null, photos);
            });
        });
    });
};

Photo.count = function(fn) {
    console.log("in count()");
    db.zcard('photos', fn);
};


