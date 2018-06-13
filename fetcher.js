var Xray = require('x-ray');
var x = Xray();

let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
    fetchTopGames: function(cb) {
        x('http://de.ign.com/', {
          title: 'title',
          items: x('ul.topgames li', [{
            title: 'a',
            link: 'a@href'
          }])
        })(cb)
    },
    fetchRss: function(cb) {
        parser.parseURL('https://www.leipzig.de/newsfeed/rss.xml', function(err, feed) {
            if (err) {
                return cb(err);
            }
            cb(null, {
                title: feed.title,
                items: feed.items
            })
        });
    }
}
