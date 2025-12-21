import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';

// 👇 Import Service vừa tạo
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-dat-ban',
  templateUrl: './datban.component.html',
  styleUrls: ['./datban.component.scss'],
  standalone: true,
  // 👇 Nhớ có HttpClientModule
  imports: [DxButtonModule, DxDataGridModule, CommonModule, DxTextBoxModule, DxSelectBoxModule, HttpClientModule],
  providers: [OrderService] 
})
export class DatBanComponent implements OnInit {

  datBans: any[] = []; // 👇 Để rỗng, chờ dữ liệu thật

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Gọi API lấy đơn hàng
    this.orderService.getOrders().subscribe({
      next: (res) => {
        // Map dữ liệu từ Server (Tiếng Anh) -> HTML (Tiếng Việt)
        this.datBans = res.map((item: any) => {
          return {
            id: item._id, // ID MongoDB
            maHoaDon: item.orderCode,
            ngayDat: item.bookingDate,
            
            // Lấy thông tin khách
            hoVaTen: item.customer?.name || 'Khách vãng lai',
            email: item.customer?.email,
            sdt: item.customer?.phone,

            soBan: item.tableNumber,
            soNguoi: item.peopleCount,

            // Lấy tiền
            tongTien: item.payment?.total || 0,
            tienCoc: item.payment?.deposit || 0,
            tienConLai: item.payment?.remaining || 0,

            // Dịch trạng thái sang tiếng Việt
            trangThai: this.translateStatus(item.status),
            originalStatus: item.status 
          };
        });
        console.log("✅ Đã tải dữ liệu thật:", this.datBans);
      },
      error: (err) => console.error("❌ Lỗi:", err)
    });
  }

  // Hàm dịch trạng thái (Anh -> Việt)
  translateStatus(status: string): string {
    const map: any = {
      'PENDING_DEPOSIT': 'Chờ thanh toán cọc',
      'DEPOSIT_EXPIRED': 'Hết hạn cọc',
      'DEPOSITED': 'Đã thanh toán cọc',
      'PAID_FULL': 'Đã thanh toán toàn bộ',
      'COMPLETED': 'Hoàn thành đơn',
      'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
  }

  // Các hàm xử lý sự kiện
  themDatBan() {
    console.log('Chức năng thêm đang phát triển');
  }

  xemChiTiet(e: any) {
    console.log('Xem:', e.data);
  }

  huy(e: any) {
    if (confirm('Chắc chắn hủy đơn này?')) {
      this.orderService.updateStatus(e.data.id, 'CANCELLED').subscribe(() => {
        alert('Đã hủy!');
        this.loadData();
      });
    }
  }

  duyet(e: any) {
    // Ví dụ duyệt là xác nhận đã cọc
    this.orderService.updateStatus(e.data.id, 'DEPOSITED').subscribe(() => {
      alert('Đã duyệt cọc!');
      this.loadData();
    });
  }

  formatMoney(value: number) {
    return value ? value.toLocaleString('vi-VN') + ' VND' : '0 VND';
  }
}