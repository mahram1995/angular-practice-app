import { AuthGuard } from "../app-security/active.guard";

export const GeneralLedgerMenu=[
    {
        label: 'Afroval Fllow',
        items: [
            {
                label: 'Cash Deposit',
                icon: 'pi pi-fw pi-bars',
                routerLink: ['/cash/cash-deposit'],
                canActivate: [AuthGuard],
                routName:'Update Lc Issue',
               
            },
            {
                label: 'Account',
                routerLink:['/cash/account'],
                canActivate: [AuthGuard],
                icon: 'pi pi-fw pi-bars'
            }
        ]
    },
    {
        label: 'GL Account',
        items: [
            {
                label: 'New',
                items: [
                    {
                        label: 'Bookmark',
                        icon: 'pi pi-fw pi-bars',
                        routerLink: ['/duplicate/duplicate-modification','update'],
                        routeName: 'bbr-duplicate-modification'
                    },
                    {
                        label: 'Video',
                        icon: 'pi pi-fw pi-bars'
                    }
                ]
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Export',
                icon: 'pi pi-fw pi-bars'
            }
        ]
    },
    {
        label: 'Edit',
        items: [
            {
                label: 'Left',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Right',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Center',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Justify',
                icon: 'pi pi-fw pi-bars'
            }
        ]
    },
    {
        label: 'Users',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-bars'
            },
            {
                label: 'Search',
                items: [
                    {
                        label: 'Filter',
                        items: [
                            {
                                label: 'Print',
                                icon: 'pi pi-fw pi-bars'
                            }
                        ]
                    },
                    {
                        icon: 'pi pi-fw pi-bars',
                        label: 'List'
                    }
                ]
            }
        ]
    },
    {
        label: 'Events',
        items: [
            {
                label: 'Edit',
                items: [
                    {
                        label: 'Save',
                        icon: 'pi pi-fw pi-bars'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-bars'
                    }
                ]
            },
            {
                label: 'Archieve',
                items: [
                    {
                        label: 'Remove',
                        icon: 'pi pi-fw pi-bars'
                    }
                ]
            }
        ]
    }
];