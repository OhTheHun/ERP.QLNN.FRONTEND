import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { RoleService } from '../../shared/services/roles-service';
import { HttpClientModule } from '@angular/common/http'; 
@Component({
  selector: 'app-vai-tro',
  templateUrl: 'vaitro.component.html',
  styleUrls: ['./vaitro.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    DxButtonModule, 
    DxDataGridModule, 
    DxTextBoxModule
  ],
  // 🔥 KHẮC PHỤC LỖI: Thêm RoleService vào providers
  providers: [RoleService]
})
export class VaiTroComponent implements OnInit {
  
  role:any[]=[];
  selectedRows: any[] = [];

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRole();
    throw new Error('Method not implemented.');
  }
   loadRole() {
        // 👇 ĐÃ ĐỔI HÀM getFoods() -> getMenu()
        this.roleService.getRole().subscribe({
            next: (res) => {
                this.role = res;
                console.log("✅ Đã tải Menu:", res);
            },
            error: (err) => console.error("❌ Lỗi tải Menu:", err)
        });
    }
    onRowInserted(e: any) {
        const monMoi = e.data; 
        console.log("Đang thêm món mới:", monMoi);

        // 👇 ĐÃ ĐỔI HÀM addFood() -> addMenu()
        this.roleService.addRole(monMoi).subscribe({
            next: (res) => {
                console.log("✅ Thêm thành công:", res);
                this.loadRole(); 
            },
            error: (err) => {
                alert("❌ Lỗi thêm mới: " + err.message);
                this.loadRole(); 
            }
        });
    }

    // 2. Sửa (Row Update)
    onRowUpdated(e: any) {
        const id = e.key;
        const updatedData = e.data;

        console.log("Đang lưu chỉnh sửa:", id, updatedData);

        // 👇 ĐÃ ĐỔI HÀM updateFood() -> updateMenu()
        this.roleService.updateRole(id, updatedData).subscribe({
            next: () => {
                console.log("✅ Cập nhật thành công!");
            },
            error: (err) => {
                alert("❌ Lỗi cập nhật: " + err.message);
                this.loadRole(); 
            }
        });
    }

    // 3. Xóa 1 dòng (Thùng rác)
    onRowRemoved(e: any) {
        const id = e.data.id; 
        console.log("Đang xóa món:", id);

        // 👇 ĐÃ ĐỔI HÀM deleteFoods() -> deleteMenu()
        this.roleService.deleteRole([id]).subscribe({
            next: () => {
                console.log("✅ Đã xóa thành công trên Server!");
            },
            error: (err) => {
                alert("❌ Lỗi xóa: " + err.message);
                this.loadRole(); 
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
            this.roleService.deleteRole(selectedIds).subscribe({
                next: () => {
                    alert("✅ Đã xóa thành công!");
                    this.loadRole();
                    this.selectedRows = [];
                },
                error: (err) =>{ alert("❌ Lỗi xóa: " + err.message), this.getMockUpData()}
            });
        }
    }

    onSelectionChanged(event: any) {
        this.selectedRows = event.selectedRowsData;
    }
    onAdd() {
    console.log('Thêm vai trò');
  }
  getMockUpData(){
    return[
    {
      id: 1,
      ten: 'Nhân viên',
      moTa: '',
      ngayTao: new Date(2025, 10, 12, 12, 1, 30),
      ngayCapNhat: new Date(2025, 10, 12, 12, 1, 30)
}];}
/*roles = [
    
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
  }*/



}
