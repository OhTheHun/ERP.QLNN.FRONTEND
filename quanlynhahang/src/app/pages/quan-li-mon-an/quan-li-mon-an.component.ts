import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { DxButtonModule, DxDataGridModule, DxTemplateModule, DxPopupModule } from "devextreme-angular"; // Thêm DxPopupModule

// 👇 ĐÃ ĐỔI THÀNH MENU SERVICE
import { MenuService } from '../../shared/services/menu.service';

@Component({
    selector: 'app-quan-li-mon-an',
    templateUrl: 'quan-li-mon-an.component.html',
    styleUrls: ['./quan-li-mon-an.component.scss'],
    standalone: true,
    imports: [DxDataGridModule, DxButtonModule, CommonModule, DxTemplateModule, HttpClientModule, DxPopupModule], // Thêm DxPopupModule vào imports
    providers: [MenuService]
})
export class QuanLiMonAnComponent implements OnInit {

    danhMucList = ['Món khô', 'Món nước', 'Đồ uống', 'Món phụ', 'Khác'];
    trangThaiOptions = ['Hoạt động', 'Ngừng hoạt động'];

    data: any[] = [];
    selectedRows: any[] = [];

    // 👇 Biến cho Popup xem ảnh (Đã có trong code bro gửi, giữ nguyên)
    isImagePopupVisible = false;
    currentImageSrc = '';

    // 👇 Hàm mở Popup (Đã có trong code bro gửi, giữ nguyên)
    openImagePopup(src: string) {
        if (src) {
            this.currentImageSrc = src;
            this.isImagePopupVisible = true;
        }
    }

    constructor(private menuService: MenuService) { }

    ngOnInit() {
        this.loadData();
    }

    // Hàm load dữ liệu
    loadData() {
        this.menuService.getMenu().subscribe({
            next: (res) => {
                this.data = res;
                console.log("✅ Đã tải Menu:", res);
            },
            error: (err) => console.error("❌ Lỗi tải Menu:", err)
        });
    }

    // 1. Thêm mới (Row Insertion)
    onRowInserted(e: any) {
        const monMoi = e.data;
        console.log("Đang thêm món mới:", monMoi);

        this.menuService.addMenu(monMoi).subscribe({
            next: (res) => {
                console.log("✅ Thêm thành công:", res);
                this.loadData(); // Load lại để lấy ID mới nhất từ server
            },
            error: (err) => {
                alert("❌ Lỗi thêm mới: " + err.message);
                this.loadData(); // Revert lại grid nếu lỗi
            }
        });
    }

    // 2. Sửa (Row Update)
    onRowUpdated(e: any) {
        const id = e.key;
        const updatedData = e.data;

        console.log("Đang lưu chỉnh sửa:", id, updatedData);

        this.menuService.updateMenu(id, updatedData).subscribe({
            next: () => {
                console.log("✅ Cập nhật thành công!");
                // Không cần loadData() cũng được vì Grid đã update UI, 
                // nhưng load lại cho chắc ăn đồng bộ cũng tốt.
            },
            error: (err) => {
                alert("❌ Lỗi cập nhật: " + err.message);
                this.loadData(); // Revert lại grid nếu lỗi
            }
        });
    }

    // 3. Xóa 1 dòng (Thùng rác trên Grid)
    onRowRemoved(e: any) {
        const id = e.data.id; // Lưu ý: keyExpr="id" nên e.key hoặc e.data.id đều được
        console.log("Đang xóa món:", id);

        this.menuService.deleteMenu([id]).subscribe({
            next: () => {
                console.log("✅ Đã xóa thành công trên Server!");
            },
            error: (err) => {
                alert("❌ Lỗi xóa: " + err.message);
                this.loadData(); // Revert lại grid nếu lỗi
            }
        });
    }

    // 4. Xóa nhiều (Nút xóa selected)
    deleteSelected() {
        if (this.selectedRows.length === 0) {
            alert("Bro chưa chọn món nào để xóa cả!");
            return;
        }

        if (confirm(`Bro có chắc muốn xóa ${this.selectedRows.length} món này không?`)) {
            const selectedIds = this.selectedRows.map(x => x.id);

            this.menuService.deleteMenu(selectedIds).subscribe({
                next: () => {
                    alert("✅ Đã xóa thành công!");
                    this.loadData();
                    this.selectedRows = [];
                },
                error: (err) => alert("❌ Lỗi xóa: " + err.message)
            });
        }
    }

    onSelectionChanged(event: any) {
        this.selectedRows = event.selectedRowsData;
    }

    // Nút thêm nhanh (Optional)
    onAdd() {
         // Grid của DevExtreme có nút thêm (+) trên toolbar rồi (allowAdding=true).
         // Hàm này dùng cho nút "Thêm sản phẩm" bên ngoài grid nếu bro muốn custom popup riêng.
         // Nếu dùng Editing mode="row" của Grid thì hàm này có thể dùng grid.instance.addRow()
         // Hoặc giữ nguyên logic thêm data test như bro viết:
        const monMoi = {
            ten: "Món Test " + Math.floor(Math.random() * 100),
            danhMuc: "Khác",
            gia: 50000,
            trangThai: "Hoạt động",
            hinhAnh: ""
        };
        this.menuService.addMenu(monMoi).subscribe(() => this.loadData());
    }
}