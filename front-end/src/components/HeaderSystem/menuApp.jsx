// export const adminMenu = [
//     { //quản lý người dùng
//         name: 'menu.admin.User', menus: [
//             {
//                 name: 'menu.admin.user-manage', link: '/system/user-manage'
//             },
//             {
//                 name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
//                 /*subMenus: [
//                     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
//                     { name: 'menu.system.system-administrator.product-manage', link: '/system/product-manage' },
//                /* ]*/
//             },

//             { //quản lý lich kham benh
//                 name: 'menu.doctor.manage-schedule', menus: [
//                     {
//                         name: 'menu.doctor.schedule', link: '/system/user-manage'
//                     },

//                 ]
//             },


//         ]
//     },
//     { //quản lý phòng khám
//         name: 'menu.admin.clinic', menus: [
//             {
//                 name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
//             },
//         ]
//     },

//     { //quản lý cẩm nang
//         name: 'menu.admin.handbook', menus: [
//             {
//                 name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
//             },
//         ]
//     },

//     { //quản lý chuyên khoa
//         name: 'menu.admin.specialty', menus: [
//             {
//                 name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
//             },
//         ]
//     },
// ];

// export const doctorMenu = [
//     {

//         name: 'menu.admin.User',
//         menus: [
//             { //quản lý lich kham benh
//                 name: 'menu.doctor.manage-schedule', menus: [
//                     {
//                         name: 'menu.doctor.schedule', link: '/system/user-redux'
//                     },

//                 ]


//             },
//         ]
//     }
// ];
export const adminMenu = [
    { // quản lý người dùng
        name: 'menu.admin.User', menus: [
            {
                name: 'menu.admin.user-manage', link: '/admin/system/user-manage'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/admin/system/manage-doctor'
            },
            { // quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', menus: [
                    {
                        name: 'menu.doctor.schedule', link: '/admin/system/user-manage'
                    },
                ]
            },
        ]
    },
    { // quản lý phòng khám
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/admin/system/manage-clinic'
            },
        ]
    },
    { // quản lý cẩm nang
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/admin/system/manage-handbook'
            },
        ]
    },
    { // quản lý chuyên khoa
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/admin/system/manage-specialty'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.User',
        menus: [
            { // quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', menus: [
                    {
                        name: 'menu.doctor.schedule', link: '/admin/system/user-redux'
                    },
                ]
            },
        ]
    }
];

