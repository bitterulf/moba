const m = require('mithril');

const Tabs = {
    view: function(vnode) {
        return m('div', vnode.attrs.tabs.map(function(tab) {
            if (tab.active) {
                return m('span', tab.title)
            }
            return m('a', {oncreate: m.route.link, href: tab.url}, tab.title)
        }));
    }
};

module.exports = Tabs;
