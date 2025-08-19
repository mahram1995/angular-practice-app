export const ExportMenuList = [
    {
      name: 'Aproval Flow',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Change Verifier', url: '#', routerLink: "/export/change-varifier" },
        { name: 'May Task', url: '#', routerLink: "/export/may-task" },
        { name: 'Pending Operation', url: '#', routerLink: "/export/pending-operation" },
       
      ]
    },
    {
      name: 'Advise',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Create Draft LC', url: '#', routerLink: "/export/create-lc-draft" },
        { name: 'Modification Draft LC', url: '#', routerLink: "/export/lc-draft-modification" },
      ]
    },
    {
      name: 'Lien',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'LC Issue', url: '#', routerLink: "/export/create-lc" },
        { name: 'LC Amendment', url: '#', routerLink: "/export/lc-modificaion" },
      ]
    },
    {
      name: 'Collection',
      icon: 'pi pi-bars',
      active: false,
      routerLink:"/export/sanction-switch",
      submenu: [
       
      ]
    },
    {
      name: 'Collection Realization',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Document Recive', url: '#', routerLink: "/export/document-receive" },
        { name: 'Document Lodge', url: '#', routerLink: "/export/document-lodge" },
      ]
    },

    {
      name: 'File',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Lodgement/Acceptence', url: '#', routerLink: "/export/create-lodgement-acceptance" },
        { name: 'Bill Payment', url: '#', routerLink: "/export/bill-payment" },
      ]
    },
    {
      name: 'Advice Enquary',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'LC Enquary', url: '#', routerLink: "/export/create-lc" },
        
      ]
    },
    {
      name: 'Report',
      icon: 'pi pi-qrcode',
      routerLink: "/export/report",
      active: false,
    }
  ];
