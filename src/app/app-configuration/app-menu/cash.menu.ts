export const CashMenuList = [
    {
        name: 'Aproval Flow',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Change Verifier', url: '#', routerLink: "/cash/change-varifier" },
            { name: 'May Task', url: '#', routerLink: "/cash/may-task" },
            { name: 'Pending Operation', url: '#', routerLink: "/cash/pending-operation" },

        ]
    },
    {
        name: 'Cash Deposit',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'Cash', url: '#', routerLink: "/cash/cash-deposit" ,  routerName:"cash-deposit", },
           
        ]
    },
    {
        name: 'Financial Intitution',
        icon: 'pi pi-bars',
        routerName:"cash-withdraw",
        active: false,
        routerLink: "/cash/account"
       
    },
    {
        name: 'Employee',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/cash/create-eployee"
       
    },
    {
        name: 'User',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/cash/create-user"
       
    },
    {
        name: 'Configuration',
        icon: 'pi pi-qrcode',
        active: false,
        submenu: [
            { name: 'General Configuratoin', url: '#', routerLink: "/cash/document-receive" },
            { name: 'Employee Configuration', url: '#', routerLink: "/cash/document-lodge" },
            { name: 'User Configuration', url: '#', routerLink: "/cash/document-lodge" },
        ]
    },

    {
        name: 'Current Session',
        icon: 'pi pi-bars',
        active: false,
        routerLink: "/cash/create-user"
       
    },
    {
        name: 'Report',
        icon: 'pi pi-bars',
        routerLink: "/cash/report",
        active: false,
    }
];
