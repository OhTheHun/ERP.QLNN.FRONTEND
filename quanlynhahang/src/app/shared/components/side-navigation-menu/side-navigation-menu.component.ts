import {
  Component,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  DxTreeViewModule,
  DxTreeViewComponent,
  DxTreeViewTypes
} from 'devextreme-angular/ui/tree-view';

import * as events from 'devextreme-angular/common/core/events';

import { navigation, Role } from '../../../app-navigation';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
  standalone: true,
  imports: [DxTreeViewModule]
})
export class SideNavigationMenuComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();
  private _selectedItem!: string;
  private _compactMode = false;
  private _items: any[] = [];

  get items() {
    return this._items;
  }

  @Input()
  set selectedItem(value: string) {
    this._selectedItem = value;
    if (this.menu?.instance) {
      this.menu.instance.selectItem(value);
    }
  }

  @Input()
  get compactMode() {
    return this._compactMode;
  }

  set compactMode(val: boolean) {
    this._compactMode = val;
    if (!this.menu?.instance) return;

    val
      ? this.menu.instance.collapseAll()
      : this.menu.instance.expandItem(this._selectedItem);
  }

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService 
  ) {}
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (!user) {
        this._items = [];
        return;
      }
      this._items = this.buildMenu(user?.role || 'ADMIN');
    });
  }
  
  private buildMenu(role: Role): any[] {
    return this.filterByRole(navigation, role).map(item => {
      if (item.path && !item.path.startsWith('/')) {
        item.path = `/${item.path}`;
      }
      return { ...item, expanded: !this._compactMode };
    });
  }

  private filterByRole(items: any[], role: Role): any[] {
    return items
      .filter(item => !item.roles || item.roles.includes(role))
      .map(item => ({
        ...item,
        items: item.items
          ? this.filterByRole(item.items, role)
          : undefined
      }));
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.emit(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}
