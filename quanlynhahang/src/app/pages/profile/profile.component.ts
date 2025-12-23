import { Component, ViewChild, OnInit } from '@angular/core';
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
import { AuthService } from '../../shared/services';

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
export class ProfileComponent implements OnInit {

  @ViewChild(DxValidationGroupComponent, { static: false })
  validationGroup!: DxValidationGroupComponent;

  isEditing = false;
  imageUrlInput = '';
  profile: any = null;

  defaultPicture: string =
    'https://cdn2.fptshop.com.vn/unsafe/800x0/meme_cho_1_e568e5b1a5.jpg';
  defaultNote: string = 'Chó là bạn, không phải tôi';

  originalEmployee: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const profile = this.authService.getProfileUser;

    if (!profile) {
      notify('Chưa có thông tin người dùng', 'error', 2000);
      return;
    }

    this.profile = { ...profile };
  }
}
