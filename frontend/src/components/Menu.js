const m = require('mithril');

const Menu = {
    view: function(vnode) {
        return m('div', vnode.attrs.entries.map(function(entry) {
            if (entry.active) {
                return m('div', entry.title)
            }
            return m('div', [
                m('a', {oncreate: m.route.link, href: entry.url}, entry.title)
            ]);
        }));
    }
};

module.exports = Menu;
