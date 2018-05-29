const m = require('mithril');

const UserContent = {
    view: function(vnode) {
        return m('div', 'user: ' + vnode.attrs.username + ' [' + vnode.attrs.id + ']');
    }
};

module.exports = UserContent;
