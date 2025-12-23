import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { 
  DxButtonModule, DxDataGridModule, DxSelectBoxModule, 
  DxTextBoxModule, DxPopupModule, DxFormModule, 
  DxNumberBoxModule, DxCheckBoxModule, DxTabsModule, DxListModule 
} from 'devextreme-angular'; 

import { OrderService } from '../../shared/services/order.service';
import { TableService } from '../../shared/services/table.service'; 
import { MenuService } from '../../shared/services/menu.service'; 
import { PromotionService } from '../../shared/services/promotion.service'; 

@Component({
  selector: 'app-dat-ban',
  templateUrl: './datban.component.html',
  styleUrls: ['./datban.component.scss'],
  standalone: true,
  imports: [
    DxButtonModule, DxDataGridModule, CommonModule, 
    DxTextBoxModule, DxSelectBoxModule, HttpClientModule, 
    DxPopupModule, DxFormModule, DxNumberBoxModule, 
    DxCheckBoxModule, DxTabsModule, DxListModule
  ],
  providers: [OrderService, TableService, MenuService, PromotionService] 
})
export class DatBanComponent implements OnInit {

  datBans: any[] = [];
  availableTables: any[] = [];
  
  // --- BIẾN CHO PHẦN CHỌN MÓN ---
  fullMenu: any[] = [];
  menuCategories: any[] = [];
  currentCategory: number = 0;
  filteredMenu: any[] = [];
  
  // --- BIẾN QUẢN LÝ POPUP ---
  isPopupVisible: boolean = false;
  isFoodPopupVisible: boolean = false; 
  isEditMode: boolean = false;        
  editingId: string = '';              
  currentFoodView: any[] = [];        

  paymentMethods = ['Cash', 'Transfer'];
  selectedTableCapacity: number = 0; 

  newOrder: any = {
    orderCode: '',
    customer: '',
    tableNumber: '',
    peopleCount: 2,
    payment: 'Cash',
    orderFood: [],
    totalAmount: 0
  };

  // --- BIẾN CHO POPUP THANH TOÁN ---
  isPaymentPopupVisible = false;
  paymentData: any = {
    orderId: '',
    tableNumber: '',
    subTotal: 0,       
    discountCode: '',  
    discountPercent: 0,
    discountValue: 0,  
    finalAmount: 0     
  };

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private menuService: MenuService,
    private promotionService: PromotionService 
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadMenu();
  }

  // =========================================================
  // 1. LOAD DỮ LIỆU TỪ SERVER
  // =========================================================
  loadData() {
    this.orderService.getOrders().subscribe((res) => {
        this.datBans = res.map((item: any) => ({
            ...item, 
            id: item._id, 
            maHoaDon: item.orderCode,   
            ngayDat: item.bookingDate,  
            hoVaTen: item.customer, 
            soBan: item.tableNumber,
            soNguoi: item.peopleCount,
            trangThai: this.translateStatus(item.status),
            originalStatus: item.status
        }));
    });
  }

  loadMenu() {
    this.menuService.getMenu().subscribe((res) => {
        // 👇 [SỬA] Lọc chỉ lấy món có trạng thái 'Hoạt động'
        const activeItems = res.filter((item: any) => item.trangThai === 'Hoạt động');

        this.fullMenu = activeItems.map((m: any) => ({
            ...m,
            quantity: 1, // Mặc định số lượng 1 khi load lên
            selected: false
        }));

        // Lấy danh sách danh mục duy nhất để tạo Tabs
        const categories = [...new Set(this.fullMenu.map(m => m.danhMuc))];
        this.menuCategories = [{ id: 0, text: 'Tất cả' }, ...categories.map((c, i) => ({ id: i + 1, text: c }))];
        
        this.filterMenu();
    });
  }

  loadAvailableTables() {
      this.tableService.getTables().subscribe((tables: any[]) => {
          this.availableTables = tables.filter((t: any)=> 
              // Chỉ lấy bàn TRỐNG hoặc bàn CỦA CHÍNH ĐƠN HÀNG ĐANG SỬA
              t.trangThai === 'EMPTY' || t.trangThai === 'Trống' || 
              (this.isEditMode && t.tenBan == this.newOrder.tableNumber)
          );
      });
  }

  // =========================================================
  // 2. LOGIC POPUP & FORM
  // =========================================================

  openAddModal() {
    this.isEditMode = false;
    this.isPopupVisible = true;
    this.resetForm();
    this.resetMenuSelection();
    this.loadAvailableTables();
  }

  openEditModal(data: any) {
    this.isEditMode = true;
    this.editingId = data.id;
    this.isPopupVisible = true;

    // Đổ dữ liệu cũ vào form
    this.newOrder = {
        orderCode: data.maHoaDon,
        customer: data.hoVaTen,
        tableNumber: data.soBan,
        peopleCount: data.soNguoi,
        payment: data.payment,
        orderFood: [],
        totalAmount: data.totalAmount
    };

    this.selectedTableCapacity = 0; // Reset tạm, sẽ tự tìm lại sau
    this.loadAvailableTables(); 

    // --- MAP LẠI MÓN ĂN TỪ CHUỖI "Món (x2)" VỀ LIST SELECTED ---
    this.resetMenuSelection(); 
    if (data.orderFood && data.orderFood.length > 0) {
        data.orderFood.forEach((foodStr: string) => {
            const match = foodStr.match(/^(.+) \(x(\d+)\)$/);
            if (match) {
                const name = match[1];
                const qty = parseInt(match[2]);
                const menuItem = this.fullMenu.find(m => m.ten === name);
                if (menuItem) {
                    menuItem.selected = true;
                    menuItem.quantity = qty;
                }
            }
        });
        this.calculateTotal(); 
    }
  }

  openFoodModal(data: any) {
    this.currentFoodView = data.orderFood || [];
    this.isFoodPopupVisible = true;
  }

  // =========================================================
  // 3. LOGIC CHỌN MÓN & TÍNH TIỀN
  // =========================================================

  resetMenuSelection() {
    this.fullMenu.forEach(m => { m.selected = false; m.quantity = 1; });
    this.filterMenu();
  }

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

  updateSelection(food: any) {
    this.calculateTotal();
  }

  calculateTotal() {
    const selected = this.fullMenu.filter(m => m.selected);
    const foodTotal = selected.reduce((sum, item) => sum + (item.gia * item.quantity), 0);
    this.newOrder.totalAmount = foodTotal;
  }

  selectTable(table: any) {
    this.newOrder.tableNumber = table.tenBan;
    this.selectedTableCapacity = table.sucChua; 
  }

  // =========================================================
  // 4. LƯU (THÊM / SỬA) & CẬP NHẬT TRẠNG THÁI
  // =========================================================

  saveOrder() {
    // Validate cơ bản
    if (!this.newOrder.tableNumber) { alert("⚠️ Chưa chọn bàn!"); return; }
    if (!this.newOrder.customer) { alert("⚠️ Chưa nhập tên khách!"); return; }
    if (this.newOrder.peopleCount <= 0) { alert("⚠️ Số người phải lớn hơn 0!"); return; }
    
    // --- KIỂM TRA SỨC CHỨA ---
    let currentCapacity = this.selectedTableCapacity;
    if (currentCapacity === 0 && this.newOrder.tableNumber) {
        const foundTable = this.availableTables.find(t => t.tenBan == this.newOrder.tableNumber);
        if (foundTable) currentCapacity = foundTable.sucChua;
    }

    if (currentCapacity > 0 && this.newOrder.peopleCount > currentCapacity) {
         alert(`⚠️ Bàn số ${this.newOrder.tableNumber} chỉ ngồi được tối đa ${currentCapacity} người!`);
         return;
    }

    // Lấy danh sách món đã chọn
    const selectedItems = this.fullMenu.filter(m => m.selected);
    if (selectedItems.length === 0) {
        alert("⚠️ Vui lòng chọn ít nhất 1 món ăn!");
        return;
    }

    const orderFoodStrings = selectedItems.map(item => `${item.ten} (x${item.quantity})`);

    const payload = {
        ...this.newOrder, 
        bookingDate: new Date(),
        status: this.isEditMode ? undefined : 'Waiting', 
        orderFood: orderFoodStrings,
        totalAmount: this.newOrder.totalAmount
    };

    if (this.isEditMode) {
        this.orderService.updateOrder(this.editingId, payload).subscribe({
            next: () => {
                alert("✅ Cập nhật đơn hàng thành công!");
                this.isPopupVisible = false;
                this.loadData();
            },
            error: (err: any) => alert("Lỗi update: " + (err.error?.error || err.message))
        });
    } else {
        this.orderService.createOrder(payload).subscribe({
            next: () => {
                alert("✅ Tạo đơn thành công!");
                this.isPopupVisible = false;
                this.loadData();
            },
            error: (err: any) => alert("Lỗi thêm: " + (err.error?.error || err.message))
        });
    }
  }

  // --- CÁC NÚT THAO TÁC TRẠNG THÁI ---
  duyet(data: any) {
    if(confirm('Duyệt đơn này và xếp bàn cho khách?')) {
        this.orderService.updateStatus(data.id || data._id, 'CONFIRMED').subscribe(() => {
            alert('✅ Đã duyệt! Bàn chuyển sang trạng thái CÓ KHÁCH.');
            this.loadData();
        });
    }
  }

  huy(data: any) {
      if(confirm('Bạn chắc chắn muốn hủy đơn này?')) {
        this.orderService.updateStatus(data.id || data._id, 'CANCELLED').subscribe(() => {
            alert('Đã hủy đơn.');
            this.loadData();
        });
      }
  }

  hoanThanh(data: any) {
    if(confirm('Khách đã thanh toán và trả bàn?')) {
        this.orderService.updateStatus(data.id || data._id, 'COMPLETED').subscribe(() => {
            alert('✅ Đơn hàng hoàn tất! Bàn đã trống.');
            this.loadData();  
        });
    }
  }

  // =========================================================
  // 5. LOGIC THANH TOÁN & KHUYẾN MÃI
  // =========================================================

  openPaymentPopup(data: any) {
    this.paymentData = {
        orderId: data.id,
        tableNumber: data.soBan,
        subTotal: data.totalAmount || 0,
        discountCode: '',
        discountPercent: 0,
        discountValue: 0,
        finalAmount: data.totalAmount || 0
    };
    this.isPaymentPopupVisible = true;
  }

  checkPromotion() {
    if (!this.paymentData.discountCode || this.paymentData.discountCode.trim() === '') return;
    
    const codeToSend = this.paymentData.discountCode.trim();

    this.promotionService.checkPromotion(codeToSend).subscribe({
        next: (promo: any) => {
            alert(`✅ Áp dụng mã: ${promo.code} - Giảm ${promo.discountPercent}%`);
            
            const percent = promo.discountPercent;
            const moneyReduced = this.paymentData.subTotal * (percent / 100);

            this.paymentData.discountPercent = percent;
            this.paymentData.discountValue = moneyReduced;
            this.paymentData.finalAmount = this.paymentData.subTotal - moneyReduced;
        },
        error: (err) => {
            alert("❌ " + (err.error?.message || "Mã không hợp lệ!"));
            this.paymentData.discountPercent = 0;
            this.paymentData.discountValue = 0;
            this.paymentData.finalAmount = this.paymentData.subTotal;
        }
    });
  }

  confirmPayment() {
    const msg = `Xác nhận thanh toán đơn hàng này?\nThực thu: ${this.paymentData.finalAmount.toLocaleString()} VND`;
    if (confirm(msg)) {
        const payload = {
            status: 'COMPLETED',
            totalAmount: this.paymentData.finalAmount,
            note: this.paymentData.discountCode 
                  ? `Mã KM: ${this.paymentData.discountCode} (-${this.paymentData.discountPercent}%)` 
                  : ''
        };

        this.orderService.updateOrder(this.paymentData.orderId, payload).subscribe({
            next: () => {
                alert("✅ Thanh toán thành công! Đơn hàng đã hoàn tất.");
                this.isPaymentPopupVisible = false;
                this.loadData(); // Load lại danh sách
            },
            error: (err: any) => alert("Lỗi thanh toán: " + err.message)
        });
    }
  }

  // =========================================================
  // 6. CÁC HÀM BỔ TRỢ (HELPER)
  // =========================================================
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
    this.selectedTableCapacity = 0; 
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