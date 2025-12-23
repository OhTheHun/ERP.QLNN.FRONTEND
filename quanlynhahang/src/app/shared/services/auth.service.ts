import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs'; 

import { HttpClient } from '@angular/common/http';

export interface IUser {
  email: string;
  role: 'ADMIN' | 'NHANVIEN' | 'THUNGAN'| ' ';
  avatarUrl?: string;
}

const defaultPath = '/';

const defaultUser: IUser = {
  email: '',
  role: 'ADMIN',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();
  private _user: IUser | null = null;
  
  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your backend URL
  //constructor(private http: HttpClient, private router: Router) {}

  get loggedIn(): boolean {
    return !!this._user;
  }

  get user(): IUser | null {
    return this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
    localStorage.setItem('lastPath', value);
  }

  constructor(private http: HttpClient, private router: Router) {
    //check role user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this._user = JSON.parse(savedUser) as IUser; 
      if (!this._user.role) {
        this._user.role = 'THUNGAN'; // đổi role ở đây
      }
      this.userSubject.next(this._user); 
    }

    const lastPath = localStorage.getItem('lastPath');
    if (lastPath) {
      this._lastAuthenticatedPath = lastPath;
    }
  }

  async logIn(email: string, password: string) {
    try {
      // GÁN CỨNG ROLE TEST
      const response: any = await this.http.post(`${this.apiUrl}/login`, { email, password })
      const role: 'ADMIN' | 'NHANVIEN' | 'THUNGAN' = 'ADMIN'; // thay khi có API
      this._user = { ...defaultUser, email, role };
      this.userSubject.next(this._user);
      localStorage.setItem('user', JSON.stringify(this._user));

      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user
      };
      /*const response: any = await this.http.post(`${this.apiUrl}/login`, { email, password }).toPromise();
      this._user = response.user;
      this.userSubject.next(this._user);
      localStorage.setItem('user', JSON.stringify(this._user));

      this.router.navigate(['/dashboard']);
      return { isOk: true, data: this._user };*/
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