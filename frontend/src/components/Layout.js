const m = require('mithril');

const Table = {
    view: function(vnode) {
        return m('div', { style: 'display: table; border-collapse:collapse; ' + (vnode.attrs.fullSize ? 'width: 100%;' : '') }, vnode.children);
    }
};

const Row = {
    view: function(vnode) {
        return m('div', { style: 'display: table-row;' }, vnode.children);
    }
};

const Cell = {
    view: function(vnode) {
        return m('div', { style: 'display: table-cell; border: 1px solid red;' }, vnode.children);
    }
};

const Layout = {
    view: function(vnode) {
        return [
            m(Table, [
                m(Row, [
                    m(Cell, [
                        vnode.attrs.preHeader || ''
                    ]),
                    m(Cell, [
                        m(Table, {fullSize: true}, [
                            m(Row, [
                                m(Cell, [
                                    vnode.attrs.header || ''
                                ]),
                                m(Cell, [
                                    vnode.attrs.userMenu || ''
                                ])
                            ])
                        ])
                    ])
                ]),
                m(Row, [
                    m(Cell, [
                        ''
                    ]),
                    m(Cell, [
                        vnode.attrs.tabs || ''
                    ])
                ]),
                m(Row, [
                    m(Cell, [
                        vnode.attrs.menu || ''
                    ]),
                    m(Cell, [
                        vnode.attrs.content || ''
                    ])
                ])
            ])
        ];
    }
};

module.exports = Layout;
