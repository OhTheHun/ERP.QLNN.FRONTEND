import { DxButtonModule, DxDateBoxModule } from "devextreme-angular";
import { Component } from "@angular/core";
import { DxoTitleModule } from "devextreme-angular/ui/nested";
import { CommonModule } from "@angular/common";

export interface TableItem {
  id: number;
  tenBan: string;
  trangThai:
    | 'EMPTY'
    | 'OCCUPIED'
  sucChua: number;
  tongTien?: number;
}

@Component ({
    templateUrl: 'ban.component.html',
    styleUrls: ['./ban.component.scss'],
    standalone: true,
    imports: [DxDateBoxModule, DxButtonModule, DxoTitleModule, CommonModule],
})

export class BanComponent {
    selectedDate = new Date();
    tables: TableItem[] = []

    pageSize = 6; 
    currentPage = 1;
    ngOnInit() {
        this.tables = [
            { id: 1, tenBan: 'Bàn 1', trangThai: 'EMPTY', sucChua: 2 },
            { id: 2, tenBan: 'Bàn 2', trangThai: 'EMPTY', sucChua: 2 },
            { id: 3, tenBan: 'Bàn 3', trangThai: 'EMPTY', sucChua: 2 },
            { id: 4, tenBan: 'Bàn 4', trangThai: 'OCCUPIED', sucChua: 2, tongTien: 1500000 },
            { id: 5, tenBan: 'Bàn 5', trangThai: 'EMPTY', sucChua: 2, tongTien: 700000 },
            { id: 6, tenBan: 'Bàn 6', trangThai: 'EMPTY', sucChua: 2 },
            { id: 7, tenBan: 'Bàn 7', trangThai: 'OCCUPIED', sucChua: 2, tongTien: 1500000 },
            { id: 8, tenBan: 'Bàn 8', trangThai: 'EMPTY', sucChua: 2, tongTien: 700000 },
            { id: 9, tenBan: 'Bàn 9', trangThai: 'EMPTY', sucChua: 2 },
            { id: 7, tenBan: 'Bàn 10', trangThai: 'OCCUPIED', sucChua: 2, tongTien: 1500000 },
            { id: 8, tenBan: 'Bàn 11', trangThai: 'EMPTY', sucChua: 2, tongTien: 700000 },
            { id: 9, tenBan: 'Bàn 12', trangThai: 'EMPTY', sucChua: 2 },
        ];
    }
  getStatusLabel(status: TableItem['trangThai']) {
    return {
      EMPTY: 'Bàn trống',
      OCCUPIED: 'Bàn có khách'
    }[status];
  }

  getStatusClass(status: TableItem['trangThai']) {
    return status.toLowerCase();
  }

  get pagedTables(): TableItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tables.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.tables.length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}