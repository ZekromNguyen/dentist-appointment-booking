
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
                link: '/ClinicOwner/system/manage-schedule' // Đây là mục quản lý lịch khám bệnh cho owner
            },
            {
                name: 'menu.admin.manage-booking',
                link: '/ClinicOwner/system/manage-booking' // Đây là mục quản lý đặt chỗ cho owner
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

];

// doctorMenu không cần chứa mục quản lý lịch khám bệnh, vì đã được bao gồm trong adminMenu
export const doctorMenu = [
    {
        name: 'menu.admin.User', // Đổi tên cho phù hợp với vai trò là doctor
        menus: [
            {
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/system/manage-schedule'
            },
        ]
    },
    {
        name: 'menu.doctor.treatment', // Đổi tên cho phù hợp với vai trò là doctor
        menus: [
            {
                name: 'menu.doctor.ManageTreatment',
                link: '/doctor/system/treatment'
            },
        ]
    },
];




