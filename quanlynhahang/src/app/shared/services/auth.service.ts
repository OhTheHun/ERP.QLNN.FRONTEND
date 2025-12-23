import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface IUser {
  email: string;
  role: 'ADMIN' | 'NHANVIEN' | 'THUNGAN' | '';
}

export interface ProfleUser {
  _id: string;
  fullName: string;
  passWord: string;
  role: string;
  status: string;
  email: string;
  phoneNumber: string;
}

const defaultPath = '/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  private _user: IUser | null = null;
  private profileUser: ProfleUser | null = null;

  private apiUrl = 'http://localhost:3000/api/auth';
  private _lastAuthenticatedPath: string = defaultPath;

  constructor(private http: HttpClient, private router: Router) {

    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      this._user = JSON.parse(savedUser) as IUser;
      this.userSubject.next(this._user);
    }

    const savedProfile = localStorage.getItem('profileUser');
    if (savedProfile && savedProfile !== 'undefined' && savedProfile !== 'null') {
      this.profileUser = JSON.parse(savedProfile) as ProfleUser;
    }

    const lastPath = localStorage.getItem('lastPath');
    if (lastPath) {
      this._lastAuthenticatedPath = lastPath;
    }
  }

  get loggedIn(): boolean {
    return !!this._user;
  }

  get user(): IUser | null {
    return this._user;
  }

  get getProfileUser(): ProfleUser | null {
    return this.profileUser;
  }

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
    localStorage.setItem('lastPath', value);
  }

  async logIn(
    email: string,
    password: string
  ): Promise<{ isOk: boolean; data?: IUser; message?: string }> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );

      if (!response || !response.isOk || !response.user) {
        return {
          isOk: false,
          message: response?.message || 'Đăng nhập thất bại'
        };
      }

      const apiUser = response.user;

      this.profileUser = apiUser;
      localStorage.setItem('profileUser', JSON.stringify(apiUser));

      const loggedInUser: IUser = {
        email: apiUser.email,
        role: apiUser.vaiTro || ''
      };

      this._user = loggedInUser;
      this.userSubject.next(this._user);
      localStorage.setItem('user', JSON.stringify(this._user));

      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user
      };

    } catch (error: any) {
      return {
        isOk: false,
        message: error?.error?.message || 'Không thể đăng nhập'
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

  async logOut() {
    this._user = null;
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('lastPath');
    this.router.navigate(['/login-form']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const isLoggedIn = this.authService.loggedIn;

    const authPages = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ];

    const isAuthPage = authPages.includes(
      route.routeConfig?.path || ''
    );

    if (!isLoggedIn && !isAuthPage) {
      this.router.navigate(['/login-form']);
      return false;
    }

    if (isLoggedIn && isAuthPage) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}