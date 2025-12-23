import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService { // 👈 ĐÃ ĐỔI TÊN CLASS TỪ FoodService -> MenuService

  // 👇 ĐÃ ĐỔI ĐƯỜNG DẪN API (Khớp với server.js)
  private apiUrl = 'http://localhost:3000/api/roles';

  constructor(private http: HttpClient) { }

  // 1. Lấy danh sách menu (Đổi tên hàm getFoods -> getMenu)
  getRole(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. Thêm món ăn mới (Đổi tên hàm addFood -> addMenu)
  addRole(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  // 3. Xóa nhiều món ăn (Đổi tên hàm deleteFoods -> deleteMenu)
  deleteRole(ids: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, { ids });
  }

  // 4. Cập nhật món ăn (Đổi tên hàm updateFood -> updateMenu)
  updateRole(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
  // ... (Các hàm cũ giữ nguyên)

  // 5. Lấy tổng số lượng món (Dùng cho Dashboard)
  getRoleCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }

}
