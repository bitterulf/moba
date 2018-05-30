const domready = require('domready');
const m = require('mithril');

const Layout = require('./components/Layout');
const Title = require('./components/Title');
const Tabs = require('./components/Tabs');
const Menu = require('./components/Menu');
const UserMenu = require('./components/UserMenu');
const UserContent = require('./components/UserContent');
const HelpContent = require('./components/HelpContent');
const FrontPageContent = require('./components/FrontPageContent');

const App = {
    view: function(vnode) {
        const tabs = (vnode.attrs.tabs || []).map(function(tab) {
            tab.active = tab.url === m.route.get();
            return tab;
        });

        return [
            m(Layout, {
                header: m(Title, vnode.attrs.title),
                menu: m(Menu, { entries: [
                    { title: 'Entry1', url: '/entry/1', active: true },
                    { title: 'Entry2', url: '/entry/2' },
                    { title: 'Entry3', url: '/entry/3' }
                ] }),
                tabs: m(Tabs, { tabs: tabs }),
                userMenu: m(UserMenu),
                content: m('div', vnode.attrs.content || '')
            })
        ];
    }
};

const tabList = [
    { title: 'Frontpage', url: '/' },
    { title: 'Help', url: '/help' }
];

const FrontPage = {
    view: function(vnode) {
        return m(App, {
            title: 'frontpage',
            tabs: tabList,
            content: m(FrontPageContent)
        });
    }
};

const Help = {
    view: function(vnode) {
        return m(App, {
            title: 'frontpage',
            tabs: tabList,
            content: m(HelpContent)
        });
    }
};

domready(function() {
    m.route(document.body, "/", {
        "/": FrontPage,
        "/help": Help,
        "/user/:userId": {
            onmatch: function(args, requestedPath) {
                return new Promise(function(resolve) {
                    m.request({
                        url: 'http://localhost:3000/users/'+args.userId,
                    })
                    .then(function(result) {
                        const UserPage = {
                            view: function(vnode) {
                                return m(App, {
                                    title: 'user',
                                    content: m(UserContent, result)
                                });
                            }
                        };

                        resolve(UserPage);
                    })
                });
            }
        }
    })
});
