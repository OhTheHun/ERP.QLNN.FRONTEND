import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { DxPieChartModule, DxSelectBoxModule, DxDateBoxComponent } from 'devextreme-angular';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';

// Import Service
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
  selector: 'app-dashboard', // Thêm selector cho chuẩn (tùy chọn)
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, DxSelectBoxModule, DxiSeriesModule, DxPieChartModule, DxDateBoxComponent, HttpClientModule],
  providers: [MenuService] 
})
export class DashBoardComponent implements OnInit {
  
  constructor(private menuService: MenuService) {}

  dashboardStat!: DashboardStat;
  invoiceStats: InvoiceStatistic[] = [];
  selectedDate: Date = new Date();

  ngOnInit() {
    // Khởi tạo dữ liệu mặc định
    this.dashboardStat = {
      soLuongTaiKhoan: 20, 
      soLuongBaiViet: 7,   
      soLuongMonAn: 0      
    };

    this.invoiceStats = [
      { label: 'Hủy đơn', value: 12, color: '#dc3b26ff' }, // Đỏ
      { label: 'Chờ thanh toán cọc', value: 18, color: '#312eeb' }, // Xanh
      { label: 'Hết hạn thanh toán cọc', value: 14, color: '#14f200ff' },
      { label: 'Đã thanh toán cọc', value: 20, color: '#a21afc' },
      { label: 'Đã thanh toán toàn bộ', value: 10, color: '#f0a3ff' },
      { label: 'Hoàn thành đơn', value: 22, color: '#ffee2fff' }
    ];

    // Gọi Server lấy số lượng món
    this.menuService.getMenuCount().subscribe({
        next: (res) => {
            console.log("✅ Số lượng món từ DB:", res.count);
            this.dashboardStat.soLuongMonAn = res.count;
        },
        error: (err) => console.error("❌ Lỗi lấy thống kê:", err)
    });
  }

  // 👇 HÀM QUAN TRỌNG: ÉP BIỂU ĐỒ DÙNG MÀU CỦA MÌNH
  customizePoint = (point: any) => {
    return { color: point.data.color };
  }
}