const m = require('mithril');
const Tabs = require('./Tabs');

const UserMenu = {
    oncreate: function(vnode) {
        m.request({
            url: "http://localhost:3000/users",
        })
        .then(function(result) {
            vnode.state.users = result;
        })
    },
    view: function(vnode) {
        if (!vnode.state.users) {
            return m('div', '');
        }

        return m(Tabs, {
            tabs: vnode.state.users.map(function(user) {
                return { title: user.username, url: '/user/'+user.id, active: m.route.get() === '/user/'+user.id };
            })
        });
    }
};

module.exports = UserMenu;
