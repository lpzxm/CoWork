import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const navigationConfig = [
    {
        key: 'home',
        path: '/home',
        translateKey: 'Home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super-admin', 'admin', 'coordinador'],
        subMenu: []
    },
    {
        key: 'users',
        path: '/users',
        translateKey: 'Usuarios',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super-admin', 'admin'],
        subMenu: [],
    },
    {
        key: 'todos',
        path: '/todos',
        translateKey: 'Tareas',
        icon: 'tasks',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['super-admin', 'admin', 'coordinador'],
        subMenu: [
            {
                key: 'tasks',
                path: '/tasks',
                translateKey: 'Listado',
                icon: 'tasks',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['super-admin', 'admin', 'coordinador'],
                subMenu: [],
            },
            {
                key: 'categories',
                path: '/categories',
                translateKey: 'Categorías',
                icon: 'categories',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['super-admin', 'admin'],
                subMenu: [],
            },
        ],
    },
    {
        key: 'statuses',
        path: '/statuses',
        translateKey: 'Estados',
        icon: 'statuses',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super-admin', 'admin'],
        subMenu: [],
    },
]

export default navigationConfig
