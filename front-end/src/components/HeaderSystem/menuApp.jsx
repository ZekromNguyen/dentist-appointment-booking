export const adminMenu = [
    { //hệ thống
        name: 'menu.system.header', menus: [
            {
                name: 'menu.system.system-administrator.header',
                subMenus: [
                    { name: 'menu.system.system-administrator.user-manage', link: '../../System/UserManage' },
                    { name: 'menu.system.system-administrator.product-manage', link: '/System/product-manage' },
                    { name: 'menu.system.system-administrator.register-package-group-or-account', link: '/System/register-package-group-or-account' },
                ]
            },
            // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
        ]
    },
];