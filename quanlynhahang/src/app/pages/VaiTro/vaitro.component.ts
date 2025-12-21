import { Component } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-vai-tro',
  templateUrl: './vaitro.component.html',
  styleUrls: ['./vaitro.component.scss'],
  standalone: true,
  imports: [DxButtonModule, DxDataGridModule, DxTextBoxModule]
})
export class VaiTroComponent {

roles = [
    {
      id: 1,
      ten: 'Nhân viên',
      moTa: '',
      ngayTao: new Date(2025, 10, 12, 12, 1, 30),
      ngayCapNhat: new Date(2025, 10, 12, 12, 1, 30)
    },
    {
      id: 2,
      ten: 'Admin',
      moTa: 'Quản lý toàn bộ nhân viên',
      ngayTao: new Date(2025, 10, 12, 12, 1, 30),
      ngayCapNhat: new Date(2025, 10, 12, 12, 1, 30)
    },
    {
      id: 3,
      ten: 'Khách hàng',
      moTa: '',
      ngayTao: new Date(2025, 10, 12, 12, 1, 30),
      ngayCapNhat: new Date(2025, 10, 12, 12, 1, 30)
    },
    {
      id: 4,
      ten: 'Thu ngân',
      moTa: 'Tính tiền, in hóa đơn, xuất hóa đơn cho khách hàng',
      ngayTao: new Date(2025, 10, 12, 12, 1, 30),
      ngayCapNhat: new Date(2025, 10, 12, 12, 1, 30)
    }
  ];

  onAdd() {
    console.log('Thêm vai trò');
  }
}
