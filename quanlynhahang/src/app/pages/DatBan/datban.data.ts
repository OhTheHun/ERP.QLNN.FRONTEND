export class BanAnDataService {
  get minBookingTime(): Date {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return now;
  }
  today = new Date();
  priceMin = 200000;

  FieldOrders = [
    {
      dataField: 'maHoaDon',
      label: { text: 'Mã hóa đơn' },
      editorType: 'dxTextBox',
      validationRules: [
        { type: 'required', message: 'Mã hóa đơn không được để trống' }
      ]
    },
    {
      dataField: 'ngayDat',
      label: { text: 'Ngày đặt' },
      editorType: 'dxDateBox',
      editorOptions: { 
        type: 'datetime', 
        min: this.today,
        displayFormat: 'dd/MM/yyyy HH:mm:ss' 
      },
      validationRules: [
        { type: 'required', message: 'Ngày đặt không được để trống' },
        {type: 'range', min: this.minBookingTime, message: 'Vui lòng booking trước 2 tiếng'}
      ]
    },
    {
      dataField: 'hoVaTen',
      label: { text: 'Họ và tên' },
      editorType: 'dxTextBox',
      validationRules: [
        { type: 'required', message: 'Họ và tên không được để trống' }
      ]
    },
    {
      dataField: 'email',
      label: { text: 'Email' },
      editorType: 'dxTextBox',
      validationRules: [
        { type: 'required', message: 'Email không được để trống' },
        { type: 'email', message: 'Email không hợp lệ' }
      ]
    },
    {
      dataField: 'sdt',
      label: { text: 'SĐT' },
      editorType: 'dxTextBox',
      validationRules: [
        { type: 'required', message: 'SĐT không được để trống' },
        { type: 'pattern', pattern: /^[0-9]{10,11}$/, message: 'SĐT phải là 10-11 chữ số' }
      ]
    },
    {
      dataField: 'soNguoi',
      label: { text: 'Số người' },
      editorType: 'dxNumberBox',
      editorOptions: { min: 1, max: 100 },
      validationRules: [
        { type: 'required', message: 'Số người không được để trống' },
        { type: 'range', min: 1, max: 100, message: 'Số người phải từ 1 đến 100' }
      ]
    },
    {
      dataField: 'tongTien',
      label: { text: 'Tổng tiền' },
      editorType: 'dxNumberBox',
      format: { type: 'currency', currency: 'VND' },
      editorOptions: { min: 0 },
      validationRules: [
        { type: 'required', message: 'Tổng tiền không được để trống' },
        { type: 'range', min: this.priceMin, message: 'Giá phải ≥ ' + this.priceMin }
      ]
    },
    {
      dataField: 'tienCoc',
      label: { text: 'Tiền đặt cọc' },
      editorType: 'dxNumberBox',
      format: { type: 'currency', currency: 'VND' },
      editorOptions: { min: 0 },
      validationRules: [
        { type: 'required', message: 'Tiền đặt cọc không được để trống' }
      ]
    }
  ];
}
