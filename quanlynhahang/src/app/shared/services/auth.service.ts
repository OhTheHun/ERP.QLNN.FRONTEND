import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

export interface IUser {
  email: string;
  avatarUrl?: string;
}

const defaultPath = '/';

const defaultUser = {
  email: '',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService {

  private _user: IUser | null = null;

  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
    // LƯU PATH ĐỂ REFRESH KHÔNG MẤT
    localStorage.setItem('lastPath', value);
  }

  constructor(private router: Router) {
    // RESTORE USER KHI REFRESH
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this._user = JSON.parse(savedUser);
    }

    // RESTORE PATH KHI REFRESH
    const lastPath = localStorage.getItem('lastPath');
    if (lastPath) {
      this._lastAuthenticatedPath = lastPath;
    }
  }

  async logIn(email: string, password: string) {
    try {
      // Giả lập request thành công
      this._user = { ...defaultUser, email };

      // 🔥 SAVE USER
      localStorage.setItem('user', JSON.stringify(this._user));

      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false,
        message: 'Xác thực không thành công'
      };
    }
  }

  async getUser() {
    return {
      isOk: true,
      data: this._user
    };
  }

  async createAccount(email: string, password: string) {
    try {
      this.router.navigate(['/create-account']);
      return { isOk: true };
    }
    catch {
      return {
        isOk: false,
        message: 'Failed to create account'
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      return { isOk: true };
    } catch {
      return { isOk: false, message: "Failed to change password" };
    }
  }

  async resetPassword(email: string) {
    try {
      return { isOk: true };
    } catch {
      return { isOk: false, message: "Failed to reset password" };
    }
  }

  //clear storage lưu trữ thông tin user
  async logOut() {
    this._user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('lastPath');
    this.router.navigate(['/login-form']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const isLoggedIn = this.authService.loggedIn;

    const isAuthForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ].includes(route.routeConfig?.path || defaultPath);

    if (isLoggedIn && isAuthForm) {
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form']);
      return false;
    }

    // save path hiện tại
    if (isLoggedIn) {
      const currentPath =
        '/' + route.url.map(segment => segment.path).join('/');
      this.authService.lastAuthenticatedPath =
        currentPath === '/' ? defaultPath : currentPath;
    }
    return true;
  }
}
