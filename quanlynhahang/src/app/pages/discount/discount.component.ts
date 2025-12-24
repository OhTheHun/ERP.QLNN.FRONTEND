import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// 👇 Import thư viện HTTP
import { HttpClientModule } from '@angular/common/http'; 
import { DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule } from "devextreme-angular";

// Import các Service và Component phụ trợ
import { DiscountFieldService } from "./discount.fieldpopup";
import { PopUpAddComponent } from "../../shared/components/popup-add/pop-up-add.component"; 
import { PromotionService } from "../../shared/services/promotion.service";

export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
}

@Component({
  selector: 'discount-app',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  standalone: true,
  // 👇 QUAN TRỌNG: Phải có HttpClientModule ở đây thì Service mới gọi API được
  imports: [
    DxPopupModule, 
    DxButtonModule, 
    DxFormModule, 
    PopUpAddComponent, 
    DxDataGridModule, 
    CommonModule, 
    HttpClientModule 
  ],
  providers: [PromotionService, DiscountFieldService]
})
export class DiscountComponent implements OnInit {

  promotions: any[] = []; // Dùng any[] để linh hoạt map id/_id

  popupVisible = false;
  popupTitle = '';

  selectedPromotion: any = {};
  discountField: any[] = [];

  // Lookup cho cột trạng thái trên Grid
  statusLookup = [
    { value: true, text: 'Đang áp dụng' },
    { value: false, text: 'Ngừng áp dụng' }
  ];

  constructor(
    private discountFieldService: DiscountFieldService,
    private promotionService: PromotionService // Inject Service gọi API
  ) {}

  ngOnInit(): void {
    // Lấy cấu hình các trường nhập liệu từ Service
    this.discountField = this.discountFieldService.fieldsPromotion;
    this.loadPromotions();
  }

  // --- 1. LOAD DỮ LIỆU TỪ SERVER ---
  loadPromotions() {
    this.promotionService.getPromotions().subscribe({
      next: (res) => {
        // Map _id của MongoDB sang id để Grid hiểu
        this.promotions = res.map((item: any) => ({ ...item, id: item._id }));
      },
      error: (err) => console.error("Lỗi tải dữ liệu:", err)
    });
  }

  // --- 2. MỞ POPUP THÊM MỚI ---
  openAddPopup() {
    this.popupTitle = 'Thêm khuyến mãi mới';
    this.selectedPromotion = {
      code: '',
      discountPercent: null,
      isActive: true // Mặc định là Active
    };
    this.popupVisible = true;
  }

  // --- 3. LƯU DỮ LIỆU (KHI BẤM SAVE Ở POPUP) ---
  onSaveData(data: any) {
    // Validate nhẹ
    if (!data.code || !data.discountPercent) {
        alert("Vui lòng nhập đủ thông tin!");
        return;
    }

    // Gọi API Thêm mới
    this.promotionService.addPromotion(data).subscribe({
      next: () => {
        alert("✅ Thêm thành công!");
        this.popupVisible = false;
        this.loadPromotions(); // Tải lại danh sách
      },
      error: (err: any) => alert("❌ Lỗi thêm: " + (err.error?.error || err.message))
    });
  }

  // --- 4. SỬA TRỰC TIẾP TRÊN GRID (INLINE EDIT) ---
  // Hàm này khớp với (onRowUpdating) bên HTML
  onRowUpdating(e: any) {
    e.cancel = true; // Chặn Grid tự sửa local
    
    // Gộp dữ liệu cũ và mới
    const updatedData = { ...e.oldData, ...e.newData };
    const id = updatedData.id || updatedData._id;

    this.promotionService.updatePromotion(id, updatedData).subscribe({
      next: () => {
        alert("✅ Cập nhật thành công!");
        e.component.cancelEditData(); // Đóng form sửa
        this.loadPromotions();
      },
      error: (err: any) => alert("❌ Lỗi cập nhật: " + err.message)
    });
  }

  // --- 5. XÓA TRỰC TIẾP TRÊN GRID ---
  // Hàm này khớp với (onRowRemoving) bên HTML
  onRowRemoving(e: any) {
    e.cancel = true; // Chặn Grid tự xóa local
    const id = e.data.id || e.data._id;

    this.promotionService.deletePromotion(id).subscribe({
      next: () => {
        alert("🗑️ Đã xóa khuyến mãi!");
        e.component.cancelEditData();
        this.loadPromotions();
      },
      error: (err: any) => alert("❌ Lỗi xóa: " + err.message)
    });
  }

  onCancelPopup() {
    this.popupVisible = false;
  }
}