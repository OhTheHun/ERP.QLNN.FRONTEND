import { DxButtonModule, DxDataGridModule, DxTemplateModule } from "devextreme-angular";
import { Component } from '@angular/core';
import { DxFormModule } from "devextreme-angular";
import { CommonModule } from "@angular/common";
@Component ({
    templateUrl: 'quan-li-mon-an.component.html',
    styleUrls: ['./quan-li-mon-an.component.scss'],
    standalone: true,
    imports: [DxFormModule, DxDataGridModule, DxButtonModule, CommonModule, DxTemplateModule, DxDataGridModule],
})

export class QuanLiMonAnComponent {
    min = 0;
    danhMucList = ['Cơm', 'Món nước', 'Món khô'];
    trangThaiOptions = ['Hoạt động', 'Ngừng hoạt động'];

    data = [
        { id: 1, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "https://cdnv2.tgdd.vn/mwg-static/common/Common/khhruf.jpg" },
        { id: 2, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Ngừng hoạt động", gia: 70000, hinhAnh: "" },
        { id: 3, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" },
        { id: 4, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" },
        { id: 1, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "https://cdnv2.tgdd.vn/mwg-static/common/Common/khhruf.jpg" },
        { id: 2, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Ngừng hoạt động", gia: 70000, hinhAnh: "" },
        { id: 3, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" },
        { id: 4, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" },
        { id: 1, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "https://cdnv2.tgdd.vn/mwg-static/common/Common/khhruf.jpg" },
        { id: 2, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Ngừng hoạt động", gia: 70000, hinhAnh: "" },
        { id: 3, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" },
        { id: 4, ten: "Cơm bò gyudon", danhMuc: "Cơm", trangThai: "Hoạt động", gia: 70000, hinhAnh: "" }
    ];
    onAdd() {
        console.log("Thêm sản phẩm");
    }

    onDeleteTemp() {
        console.log("Sản phẩm tạm xóa");
    }
    selectedRows: any[] = []; 

    onSelectionChanged(event: any) {
    this.selectedRows = event.selectedRowsData;
    }

    deleteSelected() {
    if (this.selectedRows.length === 0) return;
    const selectedIds = this.selectedRows.map(x => x.id);
    this.data = this.data.filter(item => !selectedIds.includes(item.id));
    this.selectedRows = [];
    }

}