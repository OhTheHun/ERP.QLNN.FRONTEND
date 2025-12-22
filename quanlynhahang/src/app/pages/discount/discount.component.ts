import { Component, OnInit } from "@angular/core";
import { DxButtonModule, DxDataGridModule, DxFormModule, DxPopupModule } from "devextreme-angular";
import { DiscountFieldService } from "./discount.fieldpopup";
import { PopUpAddComponent } from "../../shared/components/popup-add/pop-up-add.component";
import { CommonModule } from "@angular/common";



export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
}

@Component ({
    selector: 'discount-app',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss'],
    standalone: true,
    imports: [DxPopupModule, DxButtonModule, DxFormModule, PopUpAddComponent, DxDataGridModule, CommonModule],
})


export class DiscountComponent implements OnInit {
  promotions: Promotion[] = [];

  popupVisible = false;
  popupTitle = '';

  selectedPromotion: Promotion | any = {};
  discountField: any[] = [];

  statusLookup = [
    { value: true, text: 'Đang áp dụng' },
    { value: false, text: 'Không áp dụng' }
  ];

  constructor(
    private discountFieldService: DiscountFieldService
) {}

    ngOnInit(): void {
    this.discountField = this.discountFieldService.fieldsPromotion;
    this.loadPromotions();
    }


  initFields() {
    this.discountField = this.discountFieldService.fieldsPromotion;;
  }

  loadPromotions() {
    this.promotions = [
      { id: '1', code: 'HPBD', discountPercent: 50, isActive: true },
      { id: '2', code: 'SUMMER', discountPercent: 30, isActive: false }
    ];
  }
  openAddPopup() {
    this.selectedPromotion = {
      id: null,
      code: '',
      discountPercent: null,
      isActive: true
    };
    this.popupVisible = true;
  }

  openEditPopup(row: Promotion) {
    this.selectedPromotion = { ...row };
    this.popupVisible = true;
  }

  onSaveData(data: Promotion) {
    if (!data.id) {
        data.id = Date.now().toString(); 
        this.promotions.push({ ...data });
    }
    else {
        const index = this.promotions.findIndex(x => x.id === data.id);
        if (index !== -1) {
        this.promotions[index] = { ...data };
        }
    }
        this.popupVisible = false;
    }

  deletePromotion(row: Promotion) {
    this.promotions = this.promotions.filter(x => x.id !== row.id);
  }

  onCancelPopup() {
    this.popupVisible = false;
  }
}