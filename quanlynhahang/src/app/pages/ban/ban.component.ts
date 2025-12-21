import { DxButtonModule, DxDateBoxModule } from "devextreme-angular";
import { Component, OnInit } from "@angular/core"; // Nhớ import OnInit
import { DxoTitleModule } from "devextreme-angular/ui/nested";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http"; 

// Import Service
import { TableService } from "../../shared/services/table.service";

export interface TableItem {
  id: string; // Đổi thành string vì MongoDB ID là chuỗi
  tenBan: string;
  trangThai: string; // Để string cho linh hoạt
  sucChua: number;
  tongTien?: number;
}

@Component ({
    templateUrl: 'ban.component.html',
    styleUrls: ['./ban.component.scss'],
    standalone: true,
    // Nhớ thêm HttpClientModule
    imports: [DxDateBoxModule, DxButtonModule, DxoTitleModule, CommonModule, HttpClientModule],
    providers: [TableService] // Cung cấp Service
})

export class BanComponent implements OnInit {
    selectedDate = new Date();
    tables: TableItem[] = [];

    pageSize = 6; 
    currentPage = 1;

    // Inject Service
    constructor(private tableService: TableService) {}

    ngOnInit() {
        this.loadTables();
    }

    loadTables() {
        this.tableService.getTables().subscribe({
            next: (res) => {
                this.tables = res;
                console.log("✅ Đã lấy danh sách bàn:", res);
            },
            error: (err) => console.error("❌ Lỗi:", err)
        });
    }

    getStatusLabel(status: string) {
        // Map từ Code sang Tiếng Việt hiển thị
        const statusMap: any = {
            'EMPTY': 'Bàn trống',
            'BOOKED': 'Bàn đã đặt',
            'DEPOSITED': 'Bàn đã cọc',
            'OCCUPIED': 'Bàn có khách',
            'PENDING_PAYMENT': 'Chờ thanh toán'
        };
        return statusMap[status] || status;
    }

    getStatusClass(status: string) {
        return status ? status.toLowerCase() : '';
    }

    // Logic phân trang giữ nguyên
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