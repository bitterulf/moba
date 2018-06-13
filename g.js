var blessed = require('blessed');

var fetcher = require('./fetcher');

var EOL = require('os').EOL;

const open = require('open');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'tool';

var resultBox = blessed.box({
  top: '0',
  right: '0',
  width: '75%',
  height: '100%',
  content: '',
  tags: true,
  border: {
      ch: '°'
  }
});

screen.append(resultBox);

var list = blessed.List({
  top: '0',
  left: '0',
  width: '24%',
  height: '50%',
  border: {
      ch: '°'
  },
  items: [
      'ign top games',
      'rss',
      'open',
  ],
  interactive: true,
  mouse: true,
  style: {
    selected: {
        bg: 'white',
        fg: 'black',
    }
  },
})

screen.append(list);

list.on('select', function(data) {
    if (data.content === 'ign top games') {
        resultBox.setContent('{bold}loading{/bold}');
        screen.render();
        fetcher.fetchTopGames(function(err, result) {
            if (err) {
                resultBox.setContent('{bold}Error!{/bold}');
                screen.render();
            }
            else {
                resultBox.setContent('{bold}'+result.title+'{/bold}'+':'+EOL+result.items.map(function(item) { return item.title}).join(EOL) );
                screen.render();
            }
        });
    }
    else if (data.content === 'rss') {
        resultBox.setContent('{bold}loading{/bold}');
        screen.render();
        fetcher.fetchRss(function(err, result) {
            if (err) {
                resultBox.setContent('{bold}Error!{/bold}');
                screen.render();
            }
            else {
                resultBox.setContent('{bold}'+result.title+'{/bold}'+':'+EOL+result.items.map(function(item) { return item.title}).join(EOL) );
                screen.render();
            }
        });
    }
    else if (data.content === 'open') {
        open("http://www.google.com");
    }
})


var form = blessed.form({
  parent: screen,
  keys: true,
  left: 0,
  bottom: 0,
  width: 30,
  height: 8,
  bg: 'green',
  bottom: '0',
  left: '0',
  border: {
      ch: '°'
  },
});

var text = blessed.textbox({
    parent: form,
    value: '',
    name: 'text',
    inputOnFocus: true,
});

text.focus();

var submit = blessed.button({
  parent: form,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 1,
    right: 1
  },
  left: 10,
  top: 2,
  shrink: true,
  name: 'submit',
  content: 'submit',
  style: {
    bg: 'blue',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'red'
    }
  }
});

var cancel = blessed.button({
  parent: form,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 1,
    right: 1
  },
  left: 20,
  top: 2,
  shrink: true,
  name: 'cancel',
  content: 'cancel',
  style: {
    bg: 'blue',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'red'
    }
  }
});

submit.on('press', function(data) {
  form.submit();
});

cancel.on('press', function() {
  form.reset();
});

form.on('submit', function(data) {
  resultBox.setContent('{bold}'+data.text+'{/bold}');
  form.reset();

    form.destroy();
    text.destroy();
    submit.destroy();
    cancel.destroy();
    screen.render();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
