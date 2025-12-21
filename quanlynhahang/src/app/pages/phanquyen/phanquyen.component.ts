import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxSelectBoxModule
} from 'devextreme-angular';

interface PermissionModule {
  code: string;
  name: string;
  enabled: boolean;
}

@Component({
  selector: 'app-phan-quyen',
  standalone: true,
  templateUrl: './phanquyen.component.html',
  styleUrls: ['./phanquyen.component.scss'],
  imports: [
    CommonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxButtonModule
  ]
})
export class PhanQuyenComponent {

  roles = ['Admin', 'Nhân viên', 'Thu ngân'];
  selectedRole: string | null = null;

  permissions: PermissionModule[] = [
    { code: 'PRODUCT', name: 'Quản lý sản phẩm', enabled: true },
    { code: 'TABLE', name: 'Quản lý bàn ăn', enabled: true },
    { code: 'RESERVATION', name: 'Quản lý đặt bàn', enabled: true },
    { code: 'ACCOUNT', name: 'Quản lý tài khoản', enabled: false },
    { code: 'ROLE', name: 'Quản lý phân quyền', enabled: false }
  ];

  applyPermission() {
    const payload = {
      role: this.selectedRole,
      permissions: this.permissions
        .filter(p => p.enabled)
        .map(p => p.code)
    };

    console.log('Payload gửi backend:', payload);
    // Ví dụ payload:
    // { role: 'Nhân viên', permissions: ['PRODUCT','TABLE','RESERVATION'] }
  }
}
