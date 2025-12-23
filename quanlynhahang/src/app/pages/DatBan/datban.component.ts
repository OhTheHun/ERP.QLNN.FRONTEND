import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { PopUpAddComponent } from '../../shared/components/popup-add/pop-up-add.component';
import notify from 'devextreme/ui/notify';
import { BanAnDataService } from './datban.data';

@Component({
  selector: 'app-dat-ban',
  templateUrl: './datban.component.html',
  styleUrls: ['./datban.component.scss'],
  standalone: true,
  imports: [DxButtonModule, DxDataGridModule, CommonModule, DxTextBoxModule, DxSelectBoxModule, PopUpAddComponent] 
})
export class DatBanComponent {
  popupVisible = false;
  check = false;
  ThemBanAnField: any[] = [];

  constructor () {
    const dataservice = new BanAnDataService();
    this.ThemBanAnField = dataservice.FieldOrders;
  }
  datBans = [
    {
      id: 1,
      maHoaDon: '20251108-0031',
      ngayDat: '08/11/2025 16:23:01',
      hoVaTen: 'Nguyễn Văn Tài',
      email: 'abcxyz@gmail.com',
      sdt: '0123456789',

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

      soNguoi: 6,
      tongTien: 1000000,
      tienCoc: 500000,
      tienConLai: 500000,

      trangThai: 'Đã thanh toán'
    },
    {
      id: 3,
      maHoaDon: '20251108-0033',
      ngayDat: '08/11/2025 16:23:01',
      hoVaTen: 'Nguyễn Văn Tài',
      email: 'abcxyz@gmail.com',
      sdt: '0123456789',

      soNguoi: 6,
      tongTien: 1000000,
      tienCoc: 500000,
      tienConLai: 500000,

      trangThai: 'Chờ thanh toán'
    }
  ];



  themDatBan() {
    this.popupVisible = true;
  }

  onSaveData(data: any) {
    const tongTien = Number(data.tongTien) || 0;
    const tienCoc = Number(data.tienCoc) || 0;
    const tienConLai = tongTien - tienCoc;
    let trangThai = '';
    if (tienCoc === 0) {
        trangThai = 'Chờ thanh toán';
    } else if (tienConLai === 0) {
        trangThai = 'Đã thanh toán';
    } else if (tienCoc > 0) {
        trangThai = 'Đã thanh toán cọc';
    }
    this.datBans.push({...data,
        id: Math.floor(Math.random() * 20) + 1,
        maHoaDon: data.maHoaDon,
        ngayDat: data.ngayDat instanceof Date ? data.ngayDat.toLocaleString() : data.ngayDat,
        hoVaTen: data.hoVaTen,
        email: data.email,
        sdt: data.sdt,
        tongTien,
        tienCoc,
        tienConLai,
        trangThai
    });
    
  this.popupVisible = false;
  notify("Thêm thành công", "success");
  }
  
  onCancelPopup() {
  this.popupVisible = false;
  notify("Hủy thao tác", "error");
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
