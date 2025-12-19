export const navigation = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'home'
  },
  {
    text: 'Quản lý món ăn',
    path: '/admin/quan-ly-mon-an',
    icon: 'food' 
  },
  {
    text: 'Quản lý bàn',
    icon: 'event', 
    items: [
      {
        text: 'Bàn ăn',
        path: '/admin/ban-an'
      },
      {
        text: 'Đặt bàn',
        path: '/admin/dat-ban'
      }
    ]
  },
  {
    text: 'Tài khoản',
    path: '/admin/tai-khoan',
    icon: 'group'
  },
  {
    text: 'Vai trò',
    path: '/admin/vai-tro',
    icon: 'user'
  },
  {
    text: 'Tư vấn khách hàng',
    path: '/admin/tu-van-khach-hang',
    icon: 'comment'
  },
  {
    text: 'Quản lý khuyến mãi',
    path: '/admin/quan-ly-khuyen-mai',
    icon: 'preferences' // Hoặc 'money'
  }
];