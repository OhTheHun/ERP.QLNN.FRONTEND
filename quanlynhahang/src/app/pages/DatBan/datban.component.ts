import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-dat-ban',
  templateUrl: './datban.component.html',
  styleUrls: ['./datban.component.scss'],
  standalone: true,
  imports: [DxButtonModule, DxDataGridModule, CommonModule, DxTextBoxModule, DxSelectBoxModule] 
})
export class DatBanComponent {

  datBans = [
    {
      id: 1,
      maHoaDon: '20251108-0031',
      ngayDat: '08/11/2025 16:23:01',
      hoVaTen: 'Nguyễn Văn Tài',
      email: 'abcxyz@gmail.com',
      sdt: '0123456789',

      soBan: 10,
      soNguoi: 6,
      tongTien: 1000000,
      tienCoc: 500000,
      tienConLai: 500000,

      trangThai: 'Đã thanh toán cọc'
    },
    {
      id: 2,
      maHoaDon: '20251108-0032',
      ngayDat: '08/11/2025 16:23:01',
      hoVaTen: 'Nguyễn Văn Tài',
      email: 'abcxyz@gmail.com',
      sdt: '0123456789',

      soBan: 10,
      soNguoi: 6,
      tongTien: 1000000,
      tienCoc: 500000,
      tienConLai: 500000,

      trangThai: 'Hoàn thành đơn'
    },
    {
      id: 3,
      maHoaDon: '20251108-0033',
      ngayDat: '08/11/2025 16:23:01',
      hoVaTen: 'Nguyễn Văn Tài',
      email: 'abcxyz@gmail.com',
      sdt: '0123456789',

      soBan: 10,
      soNguoi: 6,
      tongTien: 1000000,
      tienCoc: 500000,
      tienConLai: 500000,

      trangThai: 'Chờ thanh toán'
    }
  ];

  themDatBan() {
    console.log('Thêm đặt bàn');
  }

  xemChiTiet(row: any) {
    console.log('Xem', row);
  }

  huy(row: any) {
    console.log('Hủy', row);
  }

  duyet(row: any) {
    console.log('Duyệt', row);
  }

  formatMoney(value: number) {
    return value.toLocaleString('vi-VN') + ' VND';
  }
}
