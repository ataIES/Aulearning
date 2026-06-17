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
    courses: {
        list: '/courses',
        create: '/courses',
        detail: (id) => `/courses/${id}`,
        update: (id) => `/courses/${id}`,
        delete: (id) => `/courses/${id}`,
    },
    enrollments: {
        list: '/enrollments',
        create: '/enrollments',
        detail: (id) => `/enrollments/${id}`,
        update: (id) => `/enrollments/${id}`,
        delete: (id) => `/enrollments/${id}`,
    },
    roles: {
        list: '/roles',
        create: '/roles',
        detail: (id) => `/roles/${id}`,
        update: (id) => `/roles/${id}`,
        delete: (id) => `/roles/${id}`,
        syncPermissions: (id) => `/roles/${id}/permissions`,
    },

    permissions: {
        list: '/permissions',
    },

    notifications: {
        list: '/notifications',
        unread: '/notifications/unread',
        markAsRead: (id) => `/notifications/${id}/read`,
    },
    files: {
        list: '/files',
        create: '/files',
        detail: (id) => `/files/${id}`,
        update: (id) => `/files/${id}`,
        delete: (id) => `/files/${id}`,
    },
    teacher: {
        courses: '/teacher/courses',
    },
    tasks: {
        list: '/tasks',
        create: '/tasks',
        detail: (id) => `/tasks/${id}`,
        update: (id) => `/tasks/${id}`,
        delete: (id) => `/tasks/${id}`,
    },
};