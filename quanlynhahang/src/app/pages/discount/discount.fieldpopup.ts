
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountFieldService {
    fieldsPromotion = [
  {
    dataField: 'code',
    label: { text: 'Mã khuyến mãi' },
    editorType: 'dxTextBox',
    editorOptions: {
    },
    validationRules: [
      {
        type: 'required',
        message: 'Mã khuyến mãi không được để trống'
      },
    ]
  },

  {
    dataField: 'discountPercent',
    label: { text: 'Phần trăm giảm (%)' },
    editorType: 'dxNumberBox',
    editorOptions: {
      min: 1,
      max: 100,
      showSpinButtons: true
    },
    validationRules: [
      {
        type: 'required',
        message: 'Vui lòng nhập phần trăm giảm'
      },
      {
        type: 'range',
        min: 1,
        max: 100,
        message: 'Phần trăm giảm phải từ 1 đến 100'
      }
    ]
  },
  {
    dataField: 'isActive',
    label: { text: 'Đang áp dụng' },
    editorType: 'dxSwitch',
    colSpan: 2,
    editorOptions: {
      switchedOnText: 'Có',
      switchedOffText: 'Không'
    }
  }
];

}