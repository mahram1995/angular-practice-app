import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Config, Menu } from "./new-menu-domain";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../app.service/common.service";


@Component({
  selector: 'new-menu',
  styleUrl: 'app.panel.menu.css',
  templateUrl: 'app.panel.menu.html',

})

export class PanelMenuComponent implements OnInit {
  options = { multi: false }
  @Input() menus: any[];
  @Output('onMenuSelect') onMenuSelect = new EventEmitter<boolean>();

  config: Config;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.config = this.mergeConfig({ multi: false });
  }

  mergeConfig(options: Config) {

    const config = {
      // selector: '#accordion',
      multi: true
    };

    return { ...config, ...options };
  }

  toggle(index: number, routerLink: any, routerName: any) {
    if (!this.config.multi) {
      this.menus
        .filter((menu, i) => i !== index && menu.active)
        .forEach(menu => (menu.active = !menu.active));
    }
    this.menus[index].active = !this.menus[index].active;

    if (routerLink) {
      this.onItemSelect(routerLink, routerName)
    }
  }

  onItemSelect(routerLink: any, routerName: any) {
    this.onMenuSelect.emit(false)
    this.router.navigate([routerLink]);
  }

}