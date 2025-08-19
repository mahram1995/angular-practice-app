export type Config = {
    multi?: boolean
};
export type Menu = {
    name: string,
    iconClass: string,
    active: boolean,
    submenu: { name: string, url: string , routerLink:string }[]
}