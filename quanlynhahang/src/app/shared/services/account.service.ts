import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService{
  private apiUrl = 'http://localhost:3000/api/account';

  constructor(private http: HttpClient) { }

  getAccount(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  addAccount(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
  deleteAccount(ids: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-multiple`, { ids });
  }

  // 4. Cập nhật món ăn (Đổi tên hàm updateFood -> updateMenu)
  updateAccount(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }
  // ... (Các hàm cũ giữ nguyên)

  // 5. Lấy tổng số lượng món (Dùng cho Dashboard)
  getAccountCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }
}