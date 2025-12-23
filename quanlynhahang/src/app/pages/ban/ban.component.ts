import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

// Import UI Modules
import { 
  DxButtonModule, DxDateBoxModule, DxPopupModule,        
  DxTextBoxModule, DxSelectBoxModule, DxNumberBoxModule,    
  DxDataGridModule, DxScrollViewModule    
} from "devextreme-angular";

// Import Services
import { TableService } from "../../shared/services/table.service";
import { MenuService } from "../../shared/services/menu.service";
import { OrderService } from "../../shared/services/order.service";
import { PromotionService } from "../../shared/services/promotion.service"; 

export interface TableItem {
  id: string;
  tenBan: string;
  trangThai: string;
  sucChua: number;
  tongTien?: number;
}

@Component({
  selector: 'app-ban',
  templateUrl: 'ban.component.html',
  styleUrls: ['./ban.component.scss'],
  standalone: true,
  imports: [
    CommonModule, HttpClientModule,
    DxDateBoxModule, DxButtonModule, DxPopupModule,       
    DxTextBoxModule, DxSelectBoxModule, DxNumberBoxModule,   
    DxDataGridModule, DxScrollViewModule   
  ],
  providers: [TableService, MenuService, OrderService, PromotionService]
})
export class BanComponent implements OnInit {
  
  // --- BIẾN DỮ LIỆU BÀN & MENU ---
  selectedDate = new Date();
  tables: TableItem[] = [];
  pageSize = 6; currentPage = 1;

  menuItems: any[] = []; filteredMenu: any[] = [];   
  categories: string[] = []; selectedCategory: string = 'Tất cả';

  // --- BIẾN CHO POPUP ĐẶT MÓN ---
  isPopupVisible = false;
  popupTitle = '';
  
  // 👇 Biến lưu sức chứa của bàn đang chọn để kiểm tra
  currentTableCapacity = 0; 

  bookingData: any = {
    customer: '', phone: '', tableNumber: '',
    peopleCount: 1, orderFood: [], status: 'Waiting', totalAmount: 0
  };
  selectedItems: any[] = []; 

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
    private tableService: TableService,
    private menuService: MenuService,
    private orderService: OrderService,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.loadTables();
    this.loadMenu(); 
  }

  // =========================================================
  // 1. QUẢN LÝ BÀN & MENU
  // =========================================================
  loadTables() {
    this.tableService.getTables().subscribe({
      next: (res: any) => this.tables = res,
      error: (err: any) => console.error(err)
    });
  }

  loadMenu() {
    this.menuService.getMenu().subscribe((res: any) => {
      // 👇 [ĐÃ SỬA] Chỉ lấy món có trạng thái 'Hoạt động'
      const activeItems = res.filter((item: any) => item.trangThai === 'Hoạt động');

      this.menuItems = activeItems;
      this.filteredMenu = activeItems;

      // Tạo danh mục từ danh sách đã lọc (để không hiện danh mục rỗng)
      const uniqueCategories = Array.from(new Set(activeItems.map((item: any) => item.danhMuc))) as string[];
      this.categories = ['Tất cả', ...uniqueCategories];
    });
  }

  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    this.filteredMenu = cat === 'Tất cả' ? this.menuItems : this.menuItems.filter((item: any) => item.danhMuc === cat);
  }

  onSearchMenu(e: any) {
    this.filteredMenu = this.menuItems.filter((item: any) => item.ten.toLowerCase().includes(e.value.toLowerCase()));
  }

  getStatusLabel(status: string) {
    const map: any = { 'EMPTY': 'Bàn trống', 'BOOKED': 'Bàn đã đặt', 'OCCUPIED': 'Bàn có khách' };
    return map[status] || status;
  }
  getStatusClass(status: string) { return status ? status.toLowerCase() : ''; }

  // Phân trang
  get pagedTables() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tables.slice(start, start + this.pageSize);
  }
  get totalPages() { return Math.ceil(this.tables.length / this.pageSize); }
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }

  // =========================================================
  // 2. LOGIC ĐẶT MÓN / SỬA MÓN
  // =========================================================
  addToOrder(item: any) {
    const existing = this.selectedItems.find(x => x.id === item.id);
    if (existing) existing.quantity++;
    else this.selectedItems.push({ ...item, quantity: 1, price: item.gia, itemName: item.ten });
    this.calculateTotal(); 
  }

  // 👇 Hàm xóa món (Lấy đúng data từ row bấm nút xóa)
  removeitem = (e: any) => {
    const itemToDelete = e.row.data;
    this.selectedItems = this.selectedItems.filter(item => item.id !== itemToDelete.id);
    this.calculateTotal();
  }

  calculateTotal(): number {
    const total = this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.bookingData.totalAmount = total; 
    return total;
  }

  parseOrderItems(orderFoodStrings: string[]) {
    if (!orderFoodStrings) return [];
    return orderFoodStrings.map(str => {
      const open = str.lastIndexOf('('), close = str.lastIndexOf(')');
      if (open === -1 || close === -1) return null;
      const name = str.substring(0, open).trim();
      const quantity = parseInt(str.substring(open + 1, close));
      // Tìm trong menuItems (đã lọc món active), nếu món đó ngừng hoạt động thì có thể không tìm thấy
      // Nhưng vì đây là parse đơn cũ, ta cứ hiển thị tên lên, giá lấy từ đơn cũ hoặc mặc định 0
      const menuItem = this.menuItems.find(m => m.ten === name);
      return { 
          id: menuItem?.id || 'unknown', 
          itemName: name, 
          quantity: quantity || 1, 
          price: menuItem?.gia || 0 
      };
    }).filter(i => i !== null);
  }

  openOrderPopup(table: TableItem) {
    this.popupTitle = `Đặt món - ${table.tenBan}`;
    
    // 👇 Lưu sức chứa để tí nữa kiểm tra
    this.currentTableCapacity = table.sucChua;
    
    this.selectedItems = [];
    this.bookingData = { 
        customer: 'Khách vãng lai', 
        phone: '', 
        tableNumber: table.tenBan, 
        peopleCount: 2, // Mặc định 2 người 
        status: 'CONFIRMED', 
        totalAmount: 0, 
        payment: 'Cash' 
    };
    this.isPopupVisible = true;
  }

  openEditPopup(table: TableItem) {
    this.popupTitle = `Sửa đơn hàng - ${table.tenBan}`;
    
    // 👇 Lưu sức chứa
    this.currentTableCapacity = table.sucChua;

    this.orderService.getActiveOrderByTable(table.tenBan).subscribe({
      next: (order: any) => {
        if (order) {
          this.bookingData = order; 
          this.selectedItems = this.parseOrderItems(order.orderFood);
          this.calculateTotal(); 
          this.isPopupVisible = true;
        }
      },
      error: (err: any) => alert("Không tìm thấy đơn hàng!")
    });
  }

  saveOrder() {
    // 1. Check món
    if (this.selectedItems.length === 0) { alert("⚠️ Chưa chọn món nào cả!"); return; }
    // 2. Check tên
    if (!this.bookingData.customer) { alert("⚠️ Vui lòng nhập tên khách!"); return; }
    
    // 3. Check SỨC CHỨA
    if (this.bookingData.peopleCount > this.currentTableCapacity) {
         alert(`⚠️ Bàn này chỉ chứa tối đa ${this.currentTableCapacity} người! Vui lòng giảm số người hoặc chọn bàn khác.`);
         return;
    }
    
    const payload = { 
        ...this.bookingData, 
        orderFood: this.selectedItems.map(i => `${i.itemName} (${i.quantity})`), 
        totalAmount: this.calculateTotal() 
    };

    if (this.bookingData._id) { // SỬA
      this.orderService.updateOrder(this.bookingData._id, payload).subscribe({
        next: () => { alert("✅ Đã cập nhật!"); this.isPopupVisible = false; this.loadTables(); },
        error: (err: any) => alert("Lỗi: " + err.message)
      });
    } else { // THÊM
      payload.orderCode = 'ORD-' + Date.now().toString().slice(-6);
      this.orderService.createOrder(payload).subscribe({
        next: () => { alert("✅ Đã mở bàn!"); this.isPopupVisible = false; this.loadTables(); },
        error: (err: any) => alert("Lỗi: " + err.message)
      });
    }
  }

  // =========================================================
  // 3. LOGIC THANH TOÁN & KHUYẾN MÃI
  // =========================================================
  
  openPaymentPopup(table: TableItem) {
    this.orderService.getActiveOrderByTable(table.tenBan).subscribe({
      next: (order: any) => {
        if (!order) { alert("Bàn này chưa có đơn hàng!"); return; }

        const total = order.totalAmount || 0;
        this.paymentData = {
            orderId: order._id,
            tableNumber: table.tenBan,
            subTotal: total,
            discountCode: '',
            discountPercent: 0,
            discountValue: 0,
            finalAmount: total
        };
        this.isPaymentPopupVisible = true;
      },
      error: () => alert("Lỗi lấy thông tin đơn hàng!")
    });
  }

  checkPromotion() {
    if (!this.paymentData.discountCode || this.paymentData.discountCode.trim() ==='' ) return;
    
    // 👇 [ĐÃ SỬA] Dùng biến codeToSend đã trim để gửi đi cho chuẩn
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
    const msg = `Xác nhận thanh toán bàn ${this.paymentData.tableNumber}?\nThực thu: ${this.paymentData.finalAmount.toLocaleString()} VND`;
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
                alert("✅ Thanh toán thành công! Bàn đã trống.");
                this.isPaymentPopupVisible = false;
                this.loadTables(); 
            },
            error: (err: any) => alert("Lỗi thanh toán: " + err.message)
        });
    }
  }
}