import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'

const navigationConfig = [

    {
        key: 'home',
        path: '/home',
        translateKey: 'Home',
	    icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['todo.home.view'],
        subMenu: []
    },

    // comentado por ahora

    // {
    //     key: 'permission',
    //     path: '/permission',
    //     translateKey: 'Permisos',
    //     icon: 'permissions',
    //     type: NAV_ITEM_TYPE_ITEM,
    //     authority: ['super-admin.permissions.view'],
    //     subMenu: [],
    // },
    // {
    //     key: 'todos',
    //     path: '/todos',
    //     translateKey: 'Todos',
    //     icon: 'tasks',
    //     type: NAV_ITEM_TYPE_COLLAPSE,
    //     authority: ['todo.task.view'],
    //     subMenu: [
    //         {
    //             key: 'tasks',
    //             path: '/tasks',
    //             translateKey: 'Tareas',
    //             icon: 'task-list',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: ['todo.task.view'],
    //             subMenu: [],
    //         },
    //         {
    //             key: 'categories',
    //             path: '/categories',
    //             translateKey: 'Categorías',
    //             icon: 'categories',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: ['todo.category.view'],
    //             subMenu: [],
    //         },
    //     ],
    // },
]

export default navigationConfig
