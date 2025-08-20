export const AdminMenuList = [
    {
        name: 'Aproval Flow',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Change Verifier', url: '#', routerLink: "/admin/charge-verifier" },
            { name: 'View Task Status', url: '#', routerLink: "/admin/my-task-status" },
            { name: 'My Task', url: '#', routerLink: "/admin/my-task" },

        ]
    },
    {
        name: 'Command',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Command Mapping', url: '#', routerLink: "/admin/create-lc-draft" },

        ]
    },
    {
        name: 'finantial institution',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/admin/finantial-institution"

    },
    {
        name: 'Employee',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/admin/create-eployee"

    },
    {
        name: 'User',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "user-list"

    },
    {
        name: 'Configuration',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'General Configuratoin', url: '#', routerLink: "/admin/document-receive" },
            { name: 'Employee Configuration', url: '#', routerLink: "/admin/document-lodge" },
            { name: 'User Configuration', url: '#', routerLink: "/admin/document-lodge" },
        ]
    },

    {
        name: 'Current Session',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/admin/create-user"

    },
    {
        name: 'Report',
        icon: 'pi pi-bars',
        routerLink: "/admin/report",
        active: false,
    }
];
