export const AdminMenuList = [
    {
        name: 'Aproval Flow',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Change Verifier', url: '#', routerLink: "/admin/charge-verifier" },
            { name: 'View Task Status', url: '#', routerLink: "/admin/pending-task" },
            { name: 'My Task', url: '#', routerLink: "/admin/my-task" },

        ]
    },
    {
        name: 'Command',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Aproval Flow Setup', url: '#', routerLink: "/admin/approval_flow_setup" },
            { name: 'Command Mapping', url: '#', routerLink: "/admin/command" },

        ]
    },
    {
        name: 'RND Project',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Dynamic Data source in Report', url: '#', routerLink: "/admin/dynamic-data-source-in-jasperreport" },
            { name: 'Panel Menu', url: '#', routerLink: "/admin/demo-panel-manue" },
            { name: 'Dynamic Report', url: '#', routerLink: "/admin/dynamic-report" },
            { name: 'Query Executor', url: '#', routerLink: "/admin/dynamic-report/query-executor" },

        ]
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
        routerLink: "/admin/user-list"

    },
    {
        name: 'Financial Institution',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/admin/financial-institute"

    },
    {
        name: 'Configuration',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Employee Configuration', url: '#', routerLink: "/admin/document-lodge" },
            { name: 'User Configuration', url: '#', routerLink: "/admin/document-lodge" },
        ]
    },
    {
        name: 'User Defined Filed',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/admin/udf-list"

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
        routerLink: "/admin/report-list",
        active: false,
    }
];
