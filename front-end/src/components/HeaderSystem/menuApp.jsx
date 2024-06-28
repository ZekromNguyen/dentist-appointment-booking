
export const adminMenu = [
    {
        name: 'menu.admin.User',
        menus: [
            {
                name: 'menu.admin.user-manage',
                link: '/ClinicOwner/system/user-manage'
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/ClinicOwner/system/doctor-manage'
            },
            {
                name: 'menu.doctor.manage-schedule',
                link: '/ClinicOwner/system/manage-schedule' // Đây là mục quản lý lịch khám bệnh cho admin
            },
        ]
    },
    {
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic',
                link: '/ClinicOwner/system/manage-clinic'
            },
        ]
    },
    {
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook',
                link: '/ClinicOwner/system/manage-handbook'
            },
        ]
    },
    {
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/ClinicOwner/system/manage-specialty'
            },
        ]
    },
];

// doctorMenu không cần chứa mục quản lý lịch khám bệnh, vì đã được bao gồm trong adminMenu
export const doctorMenu = [
    {
        name: 'menu.ClinicOwner.User', // Đổi tên cho phù hợp với vai trò là doctor
        menus: [
            {
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/system/manage-schedule'
            },
        ]
    }
];


