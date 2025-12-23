import { Routes } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { DashBoardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { QuanLiMonAnComponent } from './pages/quan-li-mon-an/quan-li-mon-an.component';
import { BanComponent } from './pages/ban/ban.component';
import { AccountComponent } from './pages/account/account.component';
import { VaiTroComponent } from './pages/VaiTro/vaitro.component';
import { DatBanComponent } from './pages/DatBan/datban.component';
import { PhanQuyenComponent } from './pages/phanquyen/phanquyen.component';
import { DiscountComponent } from './pages/discount/discount.component';
export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'dashboard',
    component: DashBoardComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'admin/quan-ly-mon-an',
    component: QuanLiMonAnComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'admin/ban-an',
    component: BanComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path:'admin/tai-khoan',
    component: AccountComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin/vai-tro',
    component: VaiTroComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin/dat-ban',
    component: DatBanComponent,
    canActivate: [AuthGuardService]

  },
  {
    path: 'admin/phan-quyen',
    component: PhanQuyenComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: 'admin/quan-ly-khuyen-mai',
    component: DiscountComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
