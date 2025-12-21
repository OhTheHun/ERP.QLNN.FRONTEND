import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // 👈 Thêm cái này
import { DxPieChartModule, DxSelectBoxModule, DxDateBoxComponent } from 'devextreme-angular';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';

// 👇 Import MenuService
import { MenuService } from '../../shared/services/menu.service';

export interface DashboardStat {
  soLuongTaiKhoan: number;      
  soLuongBaiViet: number;      
  soLuongMonAn: number;          
}

export interface InvoiceStatistic {
  label: string;
  value: number;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  // 👇 Nhớ thêm HttpClientModule vào imports
  imports: [CommonModule, DxSelectBoxModule, DxiSeriesModule, DxPieChartModule, DxDateBoxComponent, HttpClientModule],
  providers: [MenuService] // 👇 Cung cấp service ở đây
})
export class DashBoardComponent implements OnInit {
  
  // 👇 Inject MenuService vào constructor
  constructor(private menuService: MenuService) {}

  dashboardStat!: DashboardStat;
  invoiceStats: InvoiceStatistic[] = [];
  selectedDate: Date = new Date();

  ngOnInit() {
    // Khởi tạo dữ liệu mặc định (Số liệu ảo trước)
    this.dashboardStat = {
      soLuongTaiKhoan: 20, // Cái này tính sau
      soLuongBaiViet: 7,   // Cái này để trưng
      soLuongMonAn: 0      // Để 0 chờ Server trả về
    };

    this.invoiceStats = [
      { label: 'Hủy đơn', value: 12, color: '#dc2626' },
      { label: 'Chờ thanh toán cọc', value: 18, color: '#312eeb' },
      { label: 'Hết hạn thanh toán cọc', value: 14, color: '#00f2a6' },
      { label: 'Đã thanh toán cọc', value: 20, color: '#a21afc' },
      { label: 'Đã thanh toán toàn bộ', value: 10, color: '#f0a3ff' },
      { label: 'Hoàn thành đơn', value: 22, color: '#f5ff2f' }
    ];

    // 👇 GỌI SERVER ĐỂ LẤY SỐ LƯỢNG MÓN THẬT
    this.menuService.getMenuCount().subscribe({
        next: (res) => {
            console.log("✅ Số lượng món từ DB:", res.count);
            // Cập nhật vào biến dashboardStat
            this.dashboardStat.soLuongMonAn = res.count;
        },
        error: (err) => console.error("❌ Lỗi lấy thống kê:", err)
    });
  }
}