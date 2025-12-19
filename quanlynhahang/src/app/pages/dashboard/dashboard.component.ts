import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DxPieChartModule, DxSelectBoxModule, DxDateBoxComponent } from 'devextreme-angular';
import { DxiSeriesModule } from 'devextreme-angular/ui/nested';

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
  imports: [CommonModule, DxSelectBoxModule, DxiSeriesModule, DxPieChartModule, DxDateBoxComponent],
})
export class DashBoardComponent {
  constructor() {}


  dashboardStat!: DashboardStat;
  invoiceStats: InvoiceStatistic[] = [];

  selectedDate: Date = new Date();

  ngOnInit() {
    this.dashboardStat = {
      soLuongTaiKhoan: 20,
      soLuongBaiViet: 7,
      soLuongMonAn: 25
    }
    this.invoiceStats = [
      { label: 'Hủy đơn', value: 12, color: '#dc2626' },
      { label: 'Chờ thanh toán cọc', value: 18, color: '#312eeb' },
      { label: 'Hết hạn thanh toán cọc', value: 14, color: '#00f2a6' },
      { label: 'Đã thanh toán cọc', value: 20, color: '#a21afc' },
      { label: 'Đã thanh toán toàn bộ', value: 10, color: '#f0a3ff' },
      { label: 'Hoàn thành đơn', value: 22, color: '#f5ff2f' }
    ];
    };

    
}
