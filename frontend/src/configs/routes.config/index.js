import React from 'react';
import authRoute from './authRoute';

export const publicRoutes = [ ...authRoute ];

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: React.lazy(() => import('views/Home')),
        authority: ['super-admin', 'admin', 'coordinador'],
    },
    {
        key: 'users',
        path: '/users',
        component: React.lazy(() => import('views/users/Users')),
        authority: ['super-admin', 'admin'],
        base: {
            title: 'Usuarios',
            subtitle: 'Administración',
            info: 'Gestiona los usuarios del sistema.',
        }
    },
    {
        key: 'tasks',
        path: '/tasks',
        component: React.lazy(() => import('views/todo/Tasks')),
        authority: ['super-admin', 'admin', 'coordinador'],
        base: {
            title: 'Tareas',
            subtitle: 'Gestion de tareas',
            info: 'Organiza y actualiza tus tareas en un solo lugar.',
        }
    },
    {
        key: 'taskDetail',
        path: '/tasks/:id',
        component: React.lazy(() => import('views/todo/TaskDetail')),
        authority: ['super-admin', 'admin', 'coordinador'],
        base: {
            title: 'Detalle de tarea',
            subtitle: 'Gestion de tareas',
            info: 'Administra los detalles, subtareas y archivos de la tarea.',
        }
    },
    // {
    //     key: 'categories',
    //     path: '/categories',
    //     component: React.lazy(() => import('views/todo/Categories')),
    //     authority: ['super-admin', 'admin'],
    //     base: {
    //         title: 'Categorías',
    //         subtitle: 'Gestion de categorías',
    //         info: 'Organiza tus tareas por categorías.',
    //     }
    // },
    {
        key: 'statuses',
        path: '/statuses',
        component: React.lazy(() => import('views/status/Statuses')),
        authority: ['super-admin', 'admin'],
        base: {
            title: 'Estados',
            subtitle: 'Administración',
            info: 'Gestiona los estados del sistema.',
        }
    },
];