import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  
  private apiUrl = 'http://localhost:3000/api/tables';

  constructor(private http: HttpClient) { }

  // Lấy danh sách bàn
  getTables(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Thêm bàn
  addTable(table: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, table);
  }

  // Cập nhật bàn
  updateTable(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Xóa bàn
  deleteTable(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}