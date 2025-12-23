import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  // Đổi port 3000 nếu server bro chạy port khác
  private apiUrl = 'http://localhost:3000/api/promotions';

  constructor(private http: HttpClient) { }

  // 1. Lấy danh sách
  getPromotions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. Thêm mới
  addPromotion(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // 3. Cập nhật (Sửa)
  updatePromotion(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // 4. Xóa
  deletePromotion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // 👇👇👇 QUAN TRỌNG: HÀM NÀY ĐỂ CHECK MÃ LÚC THANH TOÁN 👇👇👇
  checkPromotion(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check/${code}`);
  }
}