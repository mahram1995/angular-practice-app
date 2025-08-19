export const ImportMenuList = [
    {
      name: 'Aproval Flow',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Change Verifier', url: '#', routerLink: "/import/change-varifier" },
        { name: 'May Task', url: '#', routerLink: "/import/may-task" },
        { name: 'Pending Operation', url: '#', routerLink: "/import/pending-operation" },
       
      ]
    },
    {
      name: 'Draft LC',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Create Draft LC', url: '#', routerLink: "/import/create-lc-draft", routerName:'create-draft-lc' },
        { name: 'Modification Draft LC', url: '#', routerLink: "/import/lc-draft-modification" },
      ]
    },
    {
      name: 'LC',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'LC Issue', url: '#', routerLink: "/import/create-lc" },
        { name: 'LC Amendment', url: '#', routerLink: "/import/lc-modificaion" },
      ]
    },
    {
      name: 'Sanction Switch',
      icon: 'pi pi-bars',
      active: false,
      routerLink:"/import/sanction-switch",
      submenu: [
       
      ]
    },
    {
      name: 'Document',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Document Recive', url: '#', routerLink: "/import/document-receive" },
        { name: 'Document Lodge', url: '#', routerLink: "/import/document-lodge" },
      ]
    },

    {
      name: 'Bill/Acceptance',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'Lodgement/Acceptence', url: '#', routerLink: "/import/create-lodgement-acceptance" },
        { name: 'Bill Payment', url: '#', routerLink: "/import/bill-payment" },
      ]
    },
    {
      name: 'LC Enquary',
      icon: 'pi pi-qrcode',
      active: false,
      submenu: [
        { name: 'LC Enquary', url: '#', routerLink: "/import/create-lc" },
        
      ]
    },
    {
      name: 'Report',
      icon: 'pi pi-qrcode',
      routerLink: "/import/report",
      active: false,
    }
  ];
