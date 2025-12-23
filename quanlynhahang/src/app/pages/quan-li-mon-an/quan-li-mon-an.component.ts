import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http'; 
import { DxButtonModule, DxDataGridModule, DxTemplateModule, DxFormModule } from "devextreme-angular";

// 👇 ĐÃ ĐỔI THÀNH MENU SERVICE
import { MenuService } from '../../shared/services/menu.service'; 

@Component({
    selector: 'app-quan-li-mon-an',
    templateUrl: 'quan-li-mon-an.component.html',
    styleUrls: ['./quan-li-mon-an.component.scss'],
    standalone: true,
    imports: [DxFormModule, DxDataGridModule, DxButtonModule, CommonModule, DxTemplateModule, HttpClientModule],
    providers: [MenuService] // 👇 ĐÃ ĐỔI PROVIDER
})
export class QuanLiMonAnComponent implements OnInit {

    danhMucList = ['Cơm', 'Món nước', 'Món khô', 'Rice', 'Noodle']; 
    trangThaiOptions = ['Hoạt động', 'Ngừng hoạt động'];

    data: any[] = []; 
    selectedRows: any[] = [];

    // 👇 ĐÃ ĐỔI TÊN BIẾN INJECT
    constructor(private menuService: MenuService) {}

    ngOnInit() {
        this.loadData();
    }

    // Hàm load dữ liệu
    loadData() {
        // 👇 ĐÃ ĐỔI HÀM getFoods() -> getMenu()
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

        // 👇 ĐÃ ĐỔI HÀM addFood() -> addMenu()
        this.menuService.addMenu(monMoi).subscribe({
            next: (res) => {
                console.log("✅ Thêm thành công:", res);
                this.loadData(); 
            },
            error: (err) => {
                alert("❌ Lỗi thêm mới: " + err.message);
                this.loadData(); 
            }
        });
    }

    // 2. Sửa (Row Update)
    onRowUpdated(e: any) {
        const id = e.key;
        const updatedData = e.data;

        console.log("Đang lưu chỉnh sửa:", id, updatedData);

        // 👇 ĐÃ ĐỔI HÀM updateFood() -> updateMenu()
        this.menuService.updateMenu(id, updatedData).subscribe({
            next: () => {
                console.log("✅ Cập nhật thành công!");
            },
            error: (err) => {
                alert("❌ Lỗi cập nhật: " + err.message);
                this.loadData(); 
            }
        });
    }

    // 3. Xóa 1 dòng (Thùng rác)
    onRowRemoved(e: any) {
        const id = e.data.id; 
        console.log("Đang xóa món:", id);

        // 👇 ĐÃ ĐỔI HÀM deleteFoods() -> deleteMenu()
        this.menuService.deleteMenu([id]).subscribe({
            next: () => {
                console.log("✅ Đã xóa thành công trên Server!");
            },
            error: (err) => {
                alert("❌ Lỗi xóa: " + err.message);
                this.loadData(); 
            }
        });
    }

    // 4. Xóa nhiều
    deleteSelected() {
        if (this.selectedRows.length === 0) {
            alert("Bro chưa chọn món nào để xóa cả!");
            return;
        }
        
        if (confirm(`Bro có chắc muốn xóa ${this.selectedRows.length} món này không?`)) {
            const selectedIds = this.selectedRows.map(x => x.id);
            
            // 👇 ĐÃ ĐỔI HÀM deleteFoods() -> deleteMenu()
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

    // Nút thêm test (Giữ lại nếu thích)
    onAdd() {
        const monMoi = {
            ten: "Món Test Menu " + Math.floor(Math.random() * 100),
            danhMuc: "Cơm",
            gia: 55000,
            trangThai: "Hoạt động",
            hinhAnh: ""
        };
        // 👇 ĐÃ ĐỔI HÀM addMenu
        this.menuService.addMenu(monMoi).subscribe(() => this.loadData());
    }

}