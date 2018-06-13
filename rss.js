let Parser = require('rss-parser');
let parser = new Parser();

parser.parseURL('https://www.reddit.com/.rss', function(err, feed) {
console.log(feed.title);
  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link)
  });
});

