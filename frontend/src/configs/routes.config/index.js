import React from 'react';
import authRoute from './authRoute';

export const publicRoutes = [ ...authRoute ];

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: React.lazy(() => import('views/Home')),
        authority: ['todo.home.view'],
    },
    {
        key: 'permission',
        path: '/permission',
        component: React.lazy(() => import('views/permission/Permission')),
        authority: ['super-admin.permissions.view'],
        base: {
            title: 'Permisos',
            subtitle: 'Administración',
            info: 'Gestiona usuarios, roles y permisos del sistema.',
        }
    },
    {
        key: 'tasks',
        path: '/tasks',
        component: React.lazy(() => import('views/todo/Tasks')),
        authority: ['todo.task.view'],
        base: {
            title: 'Tareas',
            subtitle: 'Gestion de tareas',
            info: 'Organiza y actualiza tus tareas en un solo lugar.',
        }
    },
    {
        key: 'categories',
        path: '/categories',
        component: React.lazy(() => import('views/todo/Categories')),
        authority: ['todo.category.view'],
        base: {
            title: 'Categorías',
            subtitle: 'Gestion de categorías',
            info: 'Organiza tus tareas por categorías.',
        }
    },
];