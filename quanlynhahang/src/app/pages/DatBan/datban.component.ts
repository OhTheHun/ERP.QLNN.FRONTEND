import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule, DxPopupModule, DxFormModule, DxNumberBoxModule, DxCheckBoxModule, DxTabsModule } from 'devextreme-angular'; 

import { OrderService } from '../../shared/services/order.service';
import { TableService } from '../../shared/services/table.service'; 
import { MenuService } from '../../shared/services/menu.service'; // Nhớ import MenuService

@Component({
  selector: 'app-dat-ban',
  templateUrl: './datban.component.html',
  styleUrls: ['./datban.component.scss'],
  standalone: true,
  imports: [DxButtonModule, DxDataGridModule, CommonModule, DxTextBoxModule, DxSelectBoxModule, HttpClientModule, DxPopupModule, DxFormModule, DxNumberBoxModule, DxCheckBoxModule, DxTabsModule],
  providers: [OrderService, TableService, MenuService] 
})
export class DatBanComponent implements OnInit {

  datBans: any[] = [];
  availableTables: any[] = [];
  
  // --- BIẾN CHO PHẦN CHỌN MÓN ---
  fullMenu: any[] = [];
  menuCategories: any[] = [];
  currentCategory: number = 0;
  filteredMenu: any[] = [];
  
  isPopupVisible: boolean = false;
  paymentMethods = ['Cash', 'Transfer'];

  newOrder: any = {
    orderCode: '',
    customer: '',
    tableNumber: '',
    peopleCount: 2,
    payment: 'Cash',
    orderFood: [],
    totalAmount: 0
  };

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadMenu();
  }

  // --- 1. LOAD DỮ LIỆU ---
  loadData() {
    this.orderService.getOrders().subscribe((res) => {
        this.datBans = res.map((item: any) => ({
            ...item, // Giữ lại các trường khác
            id: item._id,
            // 👇 MAP TÊN TIẾNG ANH (Server) -> TIẾNG VIỆT (HTML)
            maHoaDon: item.orderCode,   
            ngayDat: item.bookingDate,  
            
            // Các trường map cũ giữ nguyên
            trangThai: this.translateStatus(item.status),
            originalStatus: item.status
        }));
        
      });
  }

  loadMenu() {
    this.menuService.getMenu().subscribe((res) => {
        this.fullMenu = res.map((m: any) => ({
            ...m,
            quantity: 1, // Mặc định số lượng 1
            selected: false
        }));

        // Lấy danh sách danh mục unique
        const categories = [...new Set(this.fullMenu.map(m => m.danhMuc))];
        this.menuCategories = [{ id: 0, text: 'Tất cả' }, ...categories.map((c, i) => ({ id: i + 1, text: c }))];
        
        this.filterMenu();
    });
  }

  // --- 2. LOGIC POPUP & CHỌN MÓN ---

  // Mở Popup
  openAddModal() {
    this.isPopupVisible = true;
    this.resetForm();
    
    // Reset menu về trạng thái chưa chọn
    this.fullMenu.forEach(m => { m.selected = false; m.quantity = 1; });
    this.filterMenu();

    // Lấy bàn trống
    this.tableService.getTables().subscribe((tables) => {
        this.availableTables = tables.filter(t => t.trangThai === 'EMPTY' || t.trangThai === 'Trống');
    });
  }

  // Xử lý tab danh mục
  onTabChange(e: any) {
    this.currentCategory = e.itemData.id;
    this.filterMenu();
  }

  filterMenu() {
    if (this.currentCategory === 0) {
        this.filteredMenu = this.fullMenu;
    } else {
        const cateName = this.menuCategories.find(c => c.id === this.currentCategory).text;
        this.filteredMenu = this.fullMenu.filter(m => m.danhMuc === cateName);
    }
  }

  // Cập nhật khi tick chọn món hoặc đổi số lượng
  updateSelection(food: any) {
    this.calculateTotal();
  }

  calculateTotal() {
    const selected = this.fullMenu.filter(m => m.selected);
    const foodTotal = selected.reduce((sum, item) => sum + (item.gia * item.quantity), 0);
    this.newOrder.totalAmount = foodTotal;
  }

  selectTable(tableNumber: string) {
    this.newOrder.tableNumber = tableNumber;
  }

  // --- 3. LƯU & XỬ LÝ TRẠNG THÁI ---

  saveOrder() {
    if (!this.newOrder.tableNumber) { alert("⚠️ Chưa chọn bàn!"); return; }
    if (!this.newOrder.customer) { alert("⚠️ Chưa nhập tên khách!"); return; }

    // Tạo mảng món ăn dạng String: "Tên món (xSL)"
    const selectedItems = this.fullMenu.filter(m => m.selected);
    const orderFoodStrings = selectedItems.map(item => `${item.ten} (x${item.quantity})`);

    const payload = {
        orderCode: this.newOrder.orderCode,
        bookingDate: new Date(),
        customer: this.newOrder.customer,
        tableNumber: this.newOrder.tableNumber,
        peopleCount: this.newOrder.peopleCount,
        payment: this.newOrder.payment,
        status: 'Waiting',
        orderFood: orderFoodStrings,
        totalAmount: this.newOrder.totalAmount
    };

    this.orderService.addOrder(payload).subscribe({
        next: () => {
            alert("✅ Tạo đơn thành công!");
            this.isPopupVisible = false;
            this.loadData();
        },
        error: (err) => alert("❌ Lỗi: " + err.message)
    });
  }

  // Duyệt đơn -> CONFIRMED
  duyet(data: any) {
    if(confirm('Duyệt đơn này và xếp bàn cho khách?')) {
        this.orderService.updateStatus(data.id || data._id, 'CONFIRMED').subscribe(() => {
            alert('✅ Đã duyệt! Bàn chuyển sang trạng thái CÓ KHÁCH.');
            this.loadData();
        });
    }
  }

  // Hủy đơn -> CANCELLED
  huy(data: any) {
      if(confirm('Bạn chắc chắn muốn hủy đơn này?')) {
        this.orderService.updateStatus(data.id || data._id, 'CANCELLED').subscribe(() => {
            alert('Đã hủy đơn.');
            this.loadData();
        });
      }
  }

  // 👇 HÀM BỊ THIẾU CỦA BẠN ĐÂY 👇
  // Hoàn thành -> COMPLETED (Thanh toán xong, trả bàn)
  hoanThanh(data: any) {
    if(confirm('Khách đã thanh toán và trả bàn?')) {
        this.orderService.updateStatus(data.id || data._id, 'COMPLETED').subscribe(() => {
            alert('✅ Đơn hàng hoàn tất! Bàn đã trống.');
            this.loadData();
        });
    }
  }

  // --- 4. HELPER ---
  resetForm() {
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.newOrder = {
        orderCode: `${dateStr}-${random}`,
        customer: '',
        tableNumber: '',
        peopleCount: 2,
        payment: 'Cash',
        orderFood: [],
        totalAmount: 0
    };
  }

  translateStatus(status: string): string {
    const map: any = {
      'Waiting': 'Chờ duyệt',
      'CONFIRMED': 'Đang phục vụ',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return map[status] || status;
  }

  formatMoney(val: number) { 
    return val ? val.toLocaleString('vi-VN') + ' đ' : '0 đ'; 
  }
}