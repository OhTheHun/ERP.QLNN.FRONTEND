import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import {
  DxButtonModule,
  DxDataGridModule,
  DxTemplateModule,
  DxFormModule,
  DxSelectBoxModule
} from "devextreme-angular";

export interface UserAccount {
  id: number;
  hinhAnh: string;
  ten: string;
  email: string;
  sdt: string;
  vaiTro: string;
  trangThai: string;
}

@Component({
  templateUrl: 'account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxButtonModule,
    DxTemplateModule,
    DxSelectBoxModule,
    
  ],
})
export class AccountComponent implements OnInit {

  users: UserAccount[] = [];
  selectedRole: number | null = null;
  selectedStatus: number | null = null;
  vaiTros = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Nhân viên' },
  { id: 3, name: 'Khách hàng' },
  { id: 4, name: 'Thu ngân' }
];


  trangThais = [
    { id: 1, name: 'Hoạt động' },
    { id: 0, name: 'Ngưng hoạt động' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = [
      {
      id: 1,
      hinhAnh: '', // có thể để url ảnh hoặc rỗng
      ten: 'Nguyễn A',
      email: 'a@mail.com',
      sdt: '0123456789',
      vaiTro: 'Admin',
      trangThai: 'Hoạt động'
    },
    {
      id: 2,
      hinhAnh: '',
      ten: 'Nguyễn B',
      email: 'b@mail.com',
      sdt: '0987654321',
      vaiTro: 'Nhân viên',
      trangThai: 'Ngưng hoạt động'
    },
    {
      id: 3,
      hinhAnh: '',
      ten: 'Trần C',
      email: 'c@mail.com',
      sdt: '0987123456',
      vaiTro: 'Khách hàng',
      trangThai: 'Hoạt động'
    },
    {
      id: 4,
      hinhAnh: '',
      ten: 'Lê D',
      email: 'd@mail.com',
      sdt: '0912345678',
      vaiTro: 'Thu ngân',
      trangThai: 'Hoạt động'
    }
    ];
  }

}
