import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  // Đường dẫn phải khớp với server.js
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  // 1. Lấy danh sách đơn
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. Cập nhật trạng thái (Duyệt/Hủy)
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status });
  }

  // 3. Thêm đơn mới
  addOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order); 
  }
}