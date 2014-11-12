var path = require('path');
var fs = require('fs');
var async = require('async');
var yaml = require('js-yaml');
var moment = require('moment');



module.exports = function(cwd, done) {

  var export_data = {
    meta: {
      version: "000"
    },
    data: {
      posts: [],
      tags: [],
      posts_tags: []
    }
  };


  fs.readdir(cwd, function(err, posts) {
    if(err) return done(err);

    posts = posts.filter(function(name) {
      return /\.md$/.test(name) || /\.markdown$/.test(name);
    });


    async.map(posts, function(file, cb) {
      fs.readFile(file, 'utf8', function(err, content) {
        var post;
        try {
          post = new Post(file, content);
        }catch(e) {
          return cb(e);
        }
        //        var json = yaml.safeLoad(content);
        cb(null, post);
      });
    }, function(err, posts) {
      if(err) return done(err);
      var tags = {};
      var rel_id = 1;
      var tag_id = 10;
      posts.forEach(function(post) {
        post.tags.forEach(function(name) {
          var slug = name.toLowerCase().replace(/\s+/g, '-');
          var tag = tags[slug];
          if (!tag) {
            tag = tags[slug] = {
              id: ++tag_id,
              name : name,
              slug: slug,
              "description": null,
              "parent_id": null,
              "meta_title": null,
              "meta_description": null,
              created_by: 1,
              created_at: post.timestamp,
              "updated_at": post.timestamp,
              "updated_by": 1
            };
          }

          export_data.data.posts_tags.push({
            id: ++rel_id,
            post_id: post.id,
            tag_id: tag.id
          });
        });
      });

      export_data.data.tags = Object.keys(tags).map(function(name) {
        return tags[name];
      });

      export_data.data.posts = posts.map(function(p) {
        return p.toJSON();
      });

      done(null, export_data);
    });

  });
};



function Post(file, raw) {

  var sp = raw.split('---').filter(Boolean);
  this.meta = yaml.safeLoad(sp[0]);
  this.content = sp[1];
  this.timestamp = moment(this.meta.date).valueOf();

  var tags = this.meta.tags || [];

  if(typeof tags == 'string') {
    tags = tags.split(/[, ]/).filter(Boolean);
  }

  this.tags = tags;

  this.slug = file.substring(11, file.length - 9);
  Post.id = Post.id || 100;
  this.id = ++Post.id;
}

Post.prototype.toJSON = function() {
  return {
    id: this.id,
    title: this.meta.title,
    slug: this.slug,
    markdown: this.content,
    image: null,
    featured: 0,
    page: 0,
    status: "published",
    language: "en_US",
    author_id: 1,
    created_at: this.timestamp,
    created_by: 1,
    updated_at: this.timestamp,
    updated_by: 1,
    published_at: this.timestamp,
    published_by: 1
  };
};
