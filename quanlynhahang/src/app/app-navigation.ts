export type Role = 'ADMIN' | 'NHANVIEN' | 'THUNGAN' | ' ';

export const navigation = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: ['ADMIN',]
  },
  {
    text: 'Quản lý món ăn',
    path: '/admin/quan-ly-mon-an',
    icon: 'food',
    roles: ['ADMIN',]
  },
  {
    text: 'Quản lý bàn',
    icon: 'event',
    roles: ['ADMIN', 'NHANVIEN', 'THUNGAN'],
    items: [
      {
        text: 'Bàn ăn',
        path: '/admin/ban-an',
        roles: ['ADMIN', 'NHANVIEN', 'THUNGAN']
      },
      {
        text: 'Đặt bàn',
        path: '/admin/dat-ban',
        roles: ['ADMIN', 'NHANVIEN', 'THUNGAN']
      }
    ]
  },
  {
    text: 'Tài khoản',
    path: '/admin/tai-khoan',
    icon: 'group',
    roles: ['ADMIN','NHANVIEN']
  },
  {
    text: 'Quản lí vai trò',
    icon: 'user',
    roles: ['ADMIN'],
    items: [
      {
        text: 'Vai trò',
        path: '/admin/vai-tro',
        roles: ['ADMIN']
      },
      {
        text: 'Phân quyền',
        path: '/admin/phan-quyen',
        roles: ['ADMIN']
      }
    ]
  },
  {
    text: 'Tư vấn khách hàng',
    path: '/admin/tu-van-khach-hang',
    icon: 'comment',
    roles: ['ADMIN', 'THUNGAN'] 
  },
  {
    text: 'Quản lý khuyến mãi',
    path: '/admin/quan-ly-khuyen-mai',
    icon: 'preferences',
    roles: ['ADMIN',]
  }
];