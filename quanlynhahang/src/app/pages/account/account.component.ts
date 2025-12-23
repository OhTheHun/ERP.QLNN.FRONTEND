import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import {
  DxButtonModule,
  DxDataGridModule,
  DxTemplateModule,
  DxFormModule,
  DxSelectBoxModule
} from "devextreme-angular";
import { HttpClientModule } from '@angular/common/http'; 
import { AccountService } from '../../shared/services/account.service';


@Component({
  selector:'app-tai-khoan',
  templateUrl: 'account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxButtonModule,
    DxTemplateModule,
    DxSelectBoxModule,
    HttpClientModule
  ],
  providers: [AccountService] // 👇 ĐÃ ĐỔI PROVIDER
})
export class AccountComponent implements OnInit {
  selectedRows: any[] = [];
  users: any[] = [];
  selectedRole: string | null = null;
  selectedStatus: string | null = null;
   vaiTro = [
    'Admin',
    'Staff', 
    'Customer',
    'Cashier'
  ];


  trangThai = [
    'Hoạt động',
    'Ngừng hoạt động'
  ];
  constructor(private accountService: AccountService) {}
  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.accountService.getAccount().subscribe({
      next:(res)=>{
        this.users=res;
        console.log("Đã lấy tài khoản",res);
      },
      error: (err)=>{
        console.error("Loi lay tai khoan",err);
        //this.users = this.getMockData();
        console.warn("Đã tải dữ liệu giả lập do lỗi API.");
      }
    });
  }
  onRowUpdated(e: any) {
        const id = e.key;
        const updatedData = e.data;

        console.log("Đang lưu chỉnh sửa:", id, updatedData);

        // 👇 ĐÃ ĐỔI HÀM updateFood() -> updateMenu()
        this.accountService.updateAccount(id, updatedData).subscribe({
            next: () => {
                console.log("✅ Cập nhật thành công!");
            },
            error: (err) => {
                alert("❌ Lỗi cập nhật: " + err.message);
                this.loadUsers(); 
            }
        });
    }
    // 3. Xóa 1 dòng (Thùng rác)
    onRowRemoved(e: any) {
        const id = e.data.id; 
        console.log("Đang xóa món:", id);

        // 👇 ĐÃ ĐỔI HÀM deleteFoods() -> deleteMenu()
        this.accountService.deleteAccount([id]).subscribe({
            next: () => {
                console.log("✅ Đã xóa thành công trên Server!");
            },
            error: (err) => {
                alert("❌ Lỗi xóa: " + err.message);
                this.loadUsers(); 
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
            this.accountService.deleteAccount(selectedIds).subscribe({
                next: () => {
                    alert("✅ Đã xóa thành công!");
                    this.loadUsers();
                    this.selectedRows = [];
                },
                error: (err) => alert("❌ Lỗi xóa: " + err.message)
            });
        }
    }
      onRowInserted(e: any) {
        const monMoi = e.data; 
        console.log("Đang thêm món mới:", monMoi);

        // 👇 ĐÃ ĐỔI HÀM addFood() -> addMenu()
        this.accountService.addAccount(monMoi).subscribe({
            next: (res) => {
                console.log("✅ Thêm thành công:", res);
                this.loadUsers(); 
            },
            error: (err) => {
                alert("❌ Lỗi thêm mới: " + err.message);
                this.loadUsers(); 
            }
        });
    }
    onSelectionChanged(event: any) {
        this.selectedRows = event.selectedRowsData;
    }
   /*getMockData() {
    // Mock data với id dạng string giống ObjectId
    return [
      { 
        id: '507f1f77bcf86cd799439011', 
        ten: 'Nguyễn Văn A', 
        email: 'admin@gmail.com', 
        sdt: '0912345678', 
        vaiTro: 'Admin', 
        trangThai: 'Hoạt động' 
      },
      { 
        id: '507f1f77bcf86cd799439012', 
        ten: 'Trần Thị B', 
        email: 'staff@gmail.com', 
        sdt: '0987654321', 
        vaiTro: 'Staff', 
        trangThai: 'Hoạt động' 
      }
    ];
  }*/
}
/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import {
  DxButtonModule,
  DxDataGridModule,
  DxTemplateModule,
  DxFormModule,
  DxSelectBoxModule
} from "devextreme-angular";

export interface UserAccount {
  id: number;
  hinhAnh: string;
  ten: string;
  email: string;
  sdt: string;
  vaiTro: string;
  trangThai: string;
}

@Component({
  templateUrl: 'account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxDataGridModule,
    DxButtonModule,
    DxTemplateModule,
    DxSelectBoxModule,
    
  ],
})
export class AccountComponent implements OnInit {

  users: UserAccount[] = [];
  selectedRole: number | null = null;
  selectedStatus: number | null = null;
  vaiTros = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Nhân viên' },
  { id: 3, name: 'Khách hàng' },
  { id: 4, name: 'Thu ngân' }
];


  trangThais = [
    { id: 1, name: 'Hoạt động' },
    { id: 0, name: 'Ngưng hoạt động' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = [
      {
      id: 1,
      hinhAnh: '', // có thể để url ảnh hoặc rỗng
      ten: 'Nguyễn A',
      email: 'a@mail.com',
      sdt: '0123456789',
      vaiTro: 'Admin',
      trangThai: 'Hoạt động'
    },
    {
      id: 2,
      hinhAnh: '',
      ten: 'Nguyễn B',
      email: 'b@mail.com',
      sdt: '0987654321',
      vaiTro: 'Nhân viên',
      trangThai: 'Ngưng hoạt động'
    },
    {
      id: 3,
      hinhAnh: '',
      ten: 'Trần C',
      email: 'c@mail.com',
      sdt: '0987123456',
      vaiTro: 'Khách hàng',
      trangThai: 'Hoạt động'
    },
    {
      id: 4,
      hinhAnh: '',
      ten: 'Lê D',
      email: 'd@mail.com',
      sdt: '0912345678',
      vaiTro: 'Thu ngân',
      trangThai: 'Hoạt động'
    }
    ];
  }

}*/

