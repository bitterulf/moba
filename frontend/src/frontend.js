const domready = require('domready');
const m = require('mithril');

const Layout = require('./components/Layout');
const Title = require('./components/Title');
const Tabs = require('./components/Tabs');
const Menu = require('./components/Menu');
const UserContent = require('./components/UserContent');
const FrontPageContent = require('./components/FrontPageContent');

const App = {
    view: function(vnode) {
        return [
            m(Layout, {
                header: m(Title, vnode.attrs.title),
                menu: m(Menu, { entries: [
                    { title: 'Entry1', url: '/entry/1', active: true },
                    { title: 'Entry2', url: '/entry/2' },
                    { title: 'Entry3', url: '/entry/3' }
                ] }),
                tabs: m(Tabs, { tabs: [
                    { title: 'Tab1', url: '/tab/1', active: true },
                    { title: 'Tab2', url: '/tab/2' },
                    { title: 'Tab3', url: '/tab/3' }
                ] }),
                userMenu: m(Tabs, { tabs: [
                    { title: 'U1', url: '/user/1', active: true },
                    { title: 'U2', url: '/user/2' },
                    { title: 'U3', url: '/user/3' }
                ] }),
                content: m('div', vnode.attrs.content || '')
            })
        ];
    }
};

const FrontPage = {
    view: function(vnode) {
        return m(App, {
            title: 'frontpage',
            content: m(FrontPageContent)
        });
    }
};

domready(function() {
    m.route(document.body, "/", {
        "/": FrontPage,
        "/user/:userId": {
            onmatch: function(args, requestedPath) {
                return new Promise(function(resolve) {
                    fetch('http://localhost:3000/users/'+args.userId)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(responseJSON) {
                            const UserPage = {
                                view: function(vnode) {
                                    return m(App, {
                                        title: 'user',
                                        content: m(UserContent, responseJSON)
                                    });
                                }
                            };

                            resolve(UserPage);
                        });
                });
            }
        }
    })
});
