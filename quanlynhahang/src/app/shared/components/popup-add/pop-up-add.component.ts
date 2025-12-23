import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DxPopupModule, DxButtonModule, DxFormModule, DxFormComponent } from "devextreme-angular";
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'pop-up-add',
  templateUrl: './pop-up-add.component.html',
  styleUrls: ['./pop-up-add.component.scss'],
  standalone: true,
  imports: [DxPopupModule, DxFormModule, DxButtonModule]
})
export class PopUpAddComponent {
  @Input() title: string = "Thêm dữ liệu";
  @Input() visible: boolean = false;
  @Input() fields: any[] = [];
  @Input() formData: any = {}; 
  @Output() cancelAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('form', { static: false }) form: DxFormComponent | undefined;

  data: any = {};

  ngOnInit() {
    this.data = { ...this.formData };
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onCancel() {
    confirm('Bạn có chắc muốn hủy thao tác?', 'Xác nhận')
      .then((dialogResult) => {
        if (dialogResult) {
          this.cancelAction.emit();
          this.close();
        }
      });
  }

  onSave() {
    if (!this.form) {
      notify("Form chưa sẵn sàng", "error");
      return;
    }
    const validationResult = this.form.instance.validate();
    if (!validationResult.isValid) {
      notify("Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return; 
    }
    confirm('Bạn có chắc muốn thêm đặt bàn?', 'Xác nhận')
      .then((dialogResult) => {
        if (dialogResult) {
          this.save.emit(this.data);
          this.close();
        }
      });
  }

  cancelButtonOptions = {
    text: 'Hủy',
    type: 'danger',
    stylingMode: 'contained',
    onClick: () => this.onCancel()
  };

  saveButtonOptions = {
    text: 'Lưu',
    type: 'success',
    stylingMode: 'contained',
    onClick: () => this.onSave()
  };
}
