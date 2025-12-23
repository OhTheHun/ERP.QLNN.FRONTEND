import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule
  ]
})
export class LoginFormComponent {

  loading = false;
  formData: { email?: string; password?: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(e: Event) {
    e.preventDefault();

    const { email, password } = this.formData;

    if (!email || !password) {
      notify('Vui lòng nhập email và mật khẩu', 'error', 2000);
      return;
    }

    this.loading = true;

    const result = await this.authService.logIn(email, password);

    this.loading = false;

    if (!result.isOk) {
      notify(result.message, 'error', 2000);
    }
  }

  onCreateAccountClick() {
    this.router.navigate(['/create-account']);
  }
}
