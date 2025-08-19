export const BudgetMenuList = [
    {
        name: 'Aproval Flow',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Change Verifier', url: '#', routerLink: "#" },
            { name: 'View Task Status', url: '#', routerLink: "#" },
            { name: 'My Task', url: '#', routerLink: "#" },

        ]
    },
    {
        name: 'GL Account',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Budget GL Account', url: '#', routerLink: "/personal-budget/gl-account" },

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
        routerLink: "/admin/create-user"

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
