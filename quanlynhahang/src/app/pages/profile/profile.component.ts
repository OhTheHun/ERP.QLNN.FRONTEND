import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import {
  DxValidationGroupModule,
  DxValidatorModule,
  DxValidationGroupComponent
} from 'devextreme-angular';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    DxTextBoxModule,
    DxValidationGroupModule,
    DxValidatorModule,
    DxiValidationRuleModule
  ],
})
export class ProfileComponent {

  @ViewChild(DxValidationGroupComponent, { static: false })
  validationGroup!: DxValidationGroupComponent;
  imageUrlPattern = /^https?:\/\/.*\.jpe?g$/i;
  isEditing = false;
  imageUrlInput = '';
  
  employee = {
    Picture: 'https://guchat.vn/wp-content/uploads/2025/04/Meme-Cho-5-1.jpg',
    Notes: 'Là một nhân viên chăm chỉ, nhiệt tình và luôn sẵn sàng giúp đỡ đồng nghiệp.',
    ManagerName: 'Văn Vĩnh Thái Toàn',
    Address: 'Los Angeles, CA',
    Phone: '090 123 4567',
    Email: 'toan@gmail.com'
  };

  originalEmployee: any = {};

  toggleEdit() {
    if (!this.isEditing) {
      this.originalEmployee = JSON.parse(JSON.stringify(this.employee));
      this.imageUrlInput = this.employee.Picture; 
      this.isEditing = true;
      return;
    }

    const result = this.validationGroup.instance.validate();
    if (!result.isValid) {
      notify("Vui lòng điền đầy đủ thông tin hoặc xem kĩ lại!", "error", 2000);
      return;
    }

    this.employee.Picture = this.imageUrlInput.trim() === '' ? '' : this.imageUrlInput.trim();

    confirm("Bạn có chắc chắn muốn lưu thay đổi?", "Xác nhận")
      .then((ok: boolean) => {
        if (!ok) {
          // Rollback dữ liệu cũ
          this.employee = JSON.parse(JSON.stringify(this.originalEmployee));
          this.imageUrlInput = this.employee.Picture; // rollback textbox
          this.isEditing = false;
          notify("Đã hủy thay đổi!", "error", 2000);
          return;
        }

        this.originalEmployee = JSON.parse(JSON.stringify(this.employee));
        this.isEditing = false;
        notify("Lưu thông tin thành công!", "success", 2000);
      });
  }

  onImageUrlChanged(e: any) {
  const url = e.value?.trim() || '';
  this.imageUrlInput = url;

  if (!url) {
    this.employee.Picture = ''; 
    return;
  }
  if (this.imageUrlPattern.test(url)) {
    this.employee.Picture = url; 
  } else {
    notify("URL ảnh không hợp lệ! Chỉ chấp nhận .jpg hoặc .jpeg", "error", 2000);
  }
}

  removeImage() {
    this.imageUrlInput = ''; 
  }
}