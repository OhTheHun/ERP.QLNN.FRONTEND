import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // Đổi port 3000 nếu server bro chạy port khác
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  // 1. Lấy danh sách
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. Thêm mới (Tên chuẩn: createOrder)
  createOrder(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // 3. Cập nhật trạng thái (Duyệt/Hủy)
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status });
  }

  // 4. Cập nhật full thông tin (Sửa đơn)
  updateOrder(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // 5. Tìm đơn đang ăn tại bàn (Cho nút Sửa món bên Bàn ăn)
  getActiveOrderByTable(tableNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active/${tableNumber}`);
  } 
}