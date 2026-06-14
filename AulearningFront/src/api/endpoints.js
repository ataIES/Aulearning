export const ENDPOINTS = {

    auth: {
        login: '/auth/login',
        me: '/auth/me',
        logout: '/auth/logout',
    },

    dashboard: {
        admin: '/dashboard/admin',
        teacher: '/dashboard/teacher',
        student: '/dashboard/student',
    },

    users: {
        list: '/users',
        create: '/users',
        detail: (id) => `/users/${id}`,
        update: (id) => `/users/${id}`,
        delete: (id) => `/users/${id}`,
    },

};