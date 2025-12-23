import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject , lastValueFrom} from 'rxjs'; 

import { HttpClient } from '@angular/common/http';

export interface IUser {
  email: string;
  role: 'ADMIN' | 'NHANVIEN' | 'THUNGAN'| ' ';
  //avatarUrl?: string;
}
export interface ProfleUser {
    _id: string;
    fullName: string;
    passWord: string; // Lưu ý: Trường này thường không nên có ở Frontend
    role: string;
    status: string;
    email: string;
    phoneNumber: string;
}
const defaultPath = '/';

const defaultUser: IUser = {
  email: '',
  role: 'ADMIN',
  //avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
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
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
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

 // Trong auth.service.ts
async logIn(email: string, password: string): Promise<{ isOk: boolean; data?: IUser; message?: string }> {
    try {
      const response: any = await lastValueFrom(
            this.http.post<any>(`${this.apiUrl}/login`, { email, password })
        );
      
      if (response.isOk) {
        const apiUser = response.user;
            
            // 1. Ánh xạ dữ liệu trả về từ API vào interface IUser
            const loggedInUser: IUser = {
                email: apiUser.email,
                role: apiUser.vaiTro , 
               
            };
            this._user =loggedInUser; 
            this.userSubject.next(this._user);
            localStorage.setItem('user', JSON.stringify(this._user));

            // 2. Chuyển hướng
            this.router.navigate([this._lastAuthenticatedPath]);

            return {
                isOk: true,
                data: this._user
            };
      }

      // ✅ THÊM LỆNH RETURN CUỐI CÙNG TRONG TRY:
      // Xử lý khi API trả về 200 OK, nhưng isOk: false (ví dụ: mật khẩu sai)
      return {
          isOk: false,
          message: response.message || 'Xác thực thất bại (API báo lỗi)'
      };

    }
    catch(error: any) { // ✅ Nên đặt kiểu cho error để truy cập thuộc tính nếu cần
      return {
        isOk: false,
        // Cố gắng lấy thông báo lỗi chi tiết từ HTTP response nếu có
        message: error.error?.message || 'Xác thực không thành công'
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