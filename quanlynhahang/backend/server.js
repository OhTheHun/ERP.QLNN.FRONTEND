require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Middleware log mọi request
app.use((req, res, next) => {
    console.log(`👉 [REQUEST]: ${req.method} ${req.originalUrl}`);
    next();
});

// 1. KẾT NỐI DATABASE
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Đã kết nối MongoDB Atlas (QLNH)!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));


// =========================================================
// PHẦN 1: QUẢN LÝ MENU (MÓN ĂN)
// =========================================================

const MenuSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'Hoạt động' },
    picture: { type: String, default: '' },
    description: { type: String, default: '' }
}, { timestamps: true, toJSON: { virtuals: false }, toObject: { virtuals: false } });

const Menu = mongoose.model('Menu', MenuSchema, 'menu');

// --- API MENU ---
app.get('/api/menu', async (req, res) => {
    try {
        const rawMenu = await Menu.find().sort({ createdAt: -1 });
        const mappedMenu = rawMenu.map(item => ({
            id: item._id,
            ten: item.itemName,      
            danhMuc: item.category,  
            gia: item.price,        
            trangThai: item.status,  
            hinhAnh: item.picture   
        }));
        res.json(mappedMenu);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.post('/api/menu', async (req, res) => {
    try {
        const { ten, danhMuc, gia, trangThai, hinhAnh } = req.body;
        const newMenu = new Menu({
            itemName: ten,
            category: danhMuc,
            price: gia,
            status: trangThai || 'Hoạt động',
            picture: hinhAnh || '',
            description: 'Mô tả mặc định'
        });
        await newMenu.save();
        res.json({
            id: newMenu._id,
            ten: newMenu.itemName,
            danhMuc: newMenu.category,
            gia: newMenu.price,
            trangThai: newMenu.status,
            hinhAnh: newMenu.picture
        });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.post('/api/menu/delete-multiple', async (req, res) => {
    try {
        const { ids } = req.body;
        await Menu.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Đã xóa thành công" });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.get('/api/menu/count', async (req, res) => {
    try {
        const count = await Menu.countDocuments();
        res.json({ count: count });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.put('/api/menu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ten, danhMuc, gia, trangThai, hinhAnh } = req.body;
        const updateData = {
            itemName: ten,
            category: danhMuc,
            price: gia,
            status: trangThai,
            picture: hinhAnh
        };
        await Menu.findByIdAndUpdate(id, updateData);
        res.json({ message: "Cập nhật thành công!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});


// =========================================================
// PHẦN 2: QUẢN LÝ BÀN ĂN (TABLES)
// =========================================================

const TableSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true }, 
    status: { type: String, default: 'EMPTY' }, // EMPTY, BOOKED, OCCUPIED
    capacity: { type: Number, required: true },
    location: { type: String, default: 'Main' }, 
    currentOrderTotal: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: false }, toObject: { virtuals: false } });

const Table = mongoose.model('Table', TableSchema, 'tables');

// --- API TABLES ---
app.get('/api/tables', async (req, res) => {
    try {
        const rawTables = await Table.find().sort({ tableNumber: 1 });
        const mappedTables = rawTables.map(item => {
            let statusEnglish = 'EMPTY';
            // Map dữ liệu cũ nếu có
            if (item.status === 'Trống') statusEnglish = 'EMPTY';
            else if (item.status === 'Có khách') statusEnglish = 'OCCUPIED';
            else if (item.status === 'Đã đặt') statusEnglish = 'BOOKED';
            else statusEnglish = item.status;

            return {
                id: item._id,
                tenBan: item.tableNumber, 
                trangThai: statusEnglish, 
                sucChua: item.capacity,
                khuVuc: item.location,
                tongTien: item.currentOrderTotal
            };
        });
        res.json(mappedTables);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.post('/api/tables', async (req, res) => {
    try {
        const { tenBan, trangThai, sucChua, tongTien } = req.body;
        const newTable = new Table({
            tableNumber: tenBan,
            status: trangThai || 'EMPTY',
            capacity: sucChua,
            currentOrderTotal: tongTien || 0
        });
        await newTable.save();
        res.json(newTable);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.delete('/api/tables/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Table.findByIdAndDelete(id);
        res.json({ message: "Đã xóa bàn!" });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// [THÊM MỚI] API Cập nhật bàn ăn (Sửa tên, sức chứa, trạng thái thủ công)
app.put('/api/tables/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tenBan, trangThai, sucChua, tongTien } = req.body;
        
        const updateData = {};
        if (tenBan) updateData.tableNumber = tenBan;
        if (trangThai) updateData.status = trangThai;
        if (sucChua) updateData.capacity = sucChua;
        if (tongTien !== undefined) updateData.currentOrderTotal = tongTien;

        const updatedTable = await Table.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedTable);
    } catch (e) { res.status(500).json({ error: e.message }) }
});


// =========================================================
// PHẦN 3: QUẢN LÝ TÀI KHOẢN (ACCOUNTS)
// =========================================================
const roleSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,// Tên role sẽ không trùng
        trim:true
    },
    description:{
        type:String,
        default:'Không có mô tả',
    }
}, { timestamps: true });
const Role = mongoose.model('Role', roleSchema, 'roles');

app.get('/api/roles', async (req, res) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        const mappedRole=roles.map(item=>({
            id:item._id.toString(),
            ten:item.name,
            moTa:item.description,
            ngayTao: item.createdAt,        // Ánh xạ createdAt
            ngayCapNhat: item.updatedAt
        }));
        res.json(mappedRole);
    } catch (e) { res.status(500).json({ error: e.message }) }
});
// Thêm vai trò mới
app.post('/api/roles', async (req, res) => {
    try {
        const { ten, moTa } = req.body; 

        // ✅ Tạo đối tượng Mongoose với tên trường tiếng Anh
        const newRole = new Role({ 
            name: ten, 
            description: moTa 
        });

        await newRole.save();
        res.status(201).json(newRole);
    } catch (e) { res.status(500).json({ error: e.message }) }
});
// Chỉnh sửa vai trò
app.put('/api/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const updatedRole = await Role.findByIdAndUpdate(
            id, 
            { name, description }, 
            { new: true, runValidators: true } // new: true trả về document đã update
        );

        if (!updatedRole) {
            return res.status(404).json({ error: 'Không tìm thấy vai trò.' });
        }
        res.json(updatedRole);
    } catch (e) { res.status(500).json({ error: e.message }) }
});
// Xóa vai trò
app.delete('/api/roles/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 💡 QUAN TRỌNG: Kiểm tra xem có tài khoản nào đang sử dụng vai trò này không
        const accountCount = await Account.countDocuments({ role: id });
        if (accountCount > 0) {
            return res.status(400).json({ error: `Không thể xóa. Có ${accountCount} tài khoản đang sử dụng vai trò này.` });
        }

        const deletedRole = await Role.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json({ error: 'Không tìm thấy vai trò để xóa.' });
        }

        res.json({ message: 'Đã xóa vai trò thành công.' });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

    const AccountSchema = new mongoose.Schema({
        
        fullName: { type: String, required: true },
        passWord: { type: String, default:'12345678' },
        role: { 
            type: String, 
            ref:'Role',
            required:true
        },
        status: { type: String, default: 'Hoạt động' },
        email:{type:String,required:true},
        phoneNumber:{type:String,default:''}
    }, { timestamps: true });

    const Account = mongoose.model('Account', AccountSchema, 'accounts');

    // --- API ACCOUNTS ---
    // lấy tài khoản
    app.get('/api/account', async (req, res) => {
        try {
            const rawAccount = await Account.find().sort({ createdAt: -1 });
            const mappedAccount = rawAccount.map(item => ({
                id: item._id.toString(),
                ten: item.fullName,      
                email: item.email,  
                vaiTro: item.role,        
                trangThai: item.status,  
                sdt:item.phoneNumber,
                matKhau: item.passWord ||'123456'  
            }));
            res.json(mappedAccount);
        } catch (e) { res.status(500).json({ error: e.message }) }
    });
// thêm tài khoản
app.post('/api/account', async (req, res) => {
    try {
        const { ten, email, vaiTro, trangThai, sdt, matKhau}= req.body;
        //const newAccount = new Account(req.body);
        const newAccount= new Account({
            fullName: ten,
            email: email,
            role:vaiTro||'Staff',
            status:trangThai,
            phoneNumber:sdt,
            passWord: matKhau || '123456'
        });
        await newAccount.save();
        
        

        res.json(newAccount);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.delete('/api/account/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Account.findByIdAndDelete(id);
        res.json({ message: "Đã xóa bàn!" });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

app.post('/api/account/delete-multiple', async (req, res) => {
    try {
        const { ids } = req.body;
        await Account.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Đã xóa thành công" });
    } catch (e) { res.status(500).json({ error: e.message }) }
});


app.put('/api/account/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ten, email, trangThai, vaiTro, sdt,matKhau } = req.body;
        const updateData = {};
        
        // 2. Chỉ thêm các trường nếu chúng có giá trị (tức là đã được thay đổi/gửi lên từ FE)
        // Ánh xạ tên FE sang tên DB Schema
        if (ten !== undefined) updateData.fullName = ten;
        if (email !== undefined) updateData.email = email;
        if (trangThai !== undefined) updateData.status = trangThai;
        if (vaiTro !== undefined) updateData.role = vaiTro;
        if (sdt !== undefined) updateData.phoneNumber = sdt;
        if (matKhau !== undefined) updateData.passWord = matKhau;
        const updatedAccount = await Account.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true,
            // 💡 QUAN TRỌNG: Chỉ cập nhật những trường được gửi (đã được lọc ở trên)
            // findByIdAndUpdate mặc định hành xử đúng nếu updateData không chứa undefined,
            // nhưng việc lọc rõ ràng giúp tránh lỗi
        });

        if (!updatedAccount) {
            return res.status(404).json({ error: 'Không tìm thấy tài khoản để cập nhật.' });
        }
        
        // 4. Trả về đối tượng đã cập nhật nếu cần (tùy chọn)
        res.json({ message: "Cập nhật thành công!", updated: updatedAccount });
        
    } catch (e) { 
        res.status(500).json({ error: e.message }); 
    }
});
app.get('/api/account/count', async (req, res) => {
    try {
        const count = await Account.countDocuments();
        res.json({ count: count });
    } catch (e) { res.status(500).json({ error: e.message }) }
});


app.post('/api/auth/login', async(req,res)=>{
    try{
        const {email, password}= req.body;
        // tim account theo mail
        const account =await Account.findOne({email});
        if(!account){
            return res.status(401).json({
                isOk:false,
                message:'Email hoặc mật khẩu không đúng!'
            });
        }
       const isMatch = (password === account.passWord);
        // so sanh mật khẩu
        if(!isMatch){
            return res.status(401).json({
                isOk:false,
                message:'Email hoặc mật khẩu không đúng!'
            })
        }
        if (account.status === 'Ngừng hoạt động') {
            return res.status(403).json({
                isOk: false,
                message: `Tài khoản ngừng hoạt động: ${account.email}`
            });
        }

        const userProfile={
            id:account._id.toString(),
            email:account.email,
            ten:account.fullName,
            sdt:account.phoneNumber,
            
            matKhau:account.passWord,
            trangThai:account.status,
            vaiTro:account.role 
        }
        return res.json({
            isOk:true,
            message:"Đăng nhập thành công!",
            user:userProfile
        })
    } catch(e){
        res.status(500).json({isOk:false,message:e.message});
    }
});
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new account
    const newAccount = new Account({
      email,
      matKhau: hashedPassword,
      fullName,
      phoneNumber,
      role
    });

    await newAccount.save();
    res.status(201).json({ isOk: true, message: 'Tài khoản đã được tạo thành công!' });
  } catch (e) {
    res.status(500).json({ isOk: false, message: e.message });
  }
});


// =========================================================
// PHẦN 4: QUẢN LÝ HÓA ĐƠN / ĐẶT BÀN (ORDERS) - FINAL
// =========================================================

const OrderSchema = new mongoose.Schema({
    orderCode: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    
    // 1. Khách hàng (String đơn giản)
    customer: { type: String, required: true }, 

    // 2. Thông tin bàn & người
    tableNumber: String, 
    peopleCount: Number,
    
    // 3. Thanh toán (Cash/Transfer)
    payment: { 
        type: String, 
        enum: ['Cash', 'Transfer'], 
        default: 'Cash' 
    },
    
    // 4. Tổng tiền (Lưu để thống kê)
    totalAmount: { type: Number, default: 0 },

    // 5. Món ăn (Mảng các chuỗi tên món kèm số lượng)
    orderFood: [{ type: String }], 

    // 6. Trạng thái (Logic mới)
    status: { 
        type: String, 
        default: 'Waiting', 
        enum: ['Waiting', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] 
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema, 'orders');

// --- API ORDERS ---

// 1. Lấy thống kê Dashboard (Cập nhật màu theo status mới)
app.get('/api/orders/stats', async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        const result = stats.map(item => {
            let label = item._id;
            let color = '#ccc';
            
            switch(item._id) {
                case 'Waiting': label = 'Chờ duyệt'; color = '#f59e0b'; break; // Vàng cam
                case 'CONFIRMED': label = 'Đang phục vụ'; color = '#3b82f6'; break; // Xanh dương
                case 'COMPLETED': label = 'Hoàn thành'; color = '#10b981'; break; // Xanh lá
                case 'CANCELLED': label = 'Đã hủy'; color = '#ef4444'; break; // Đỏ
            }
            return { label, value: item.count, color };
        });

        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 2. Lấy danh sách hóa đơn
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ bookingDate: -1 });
        res.json(orders);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 3. Thêm đặt bàn mới (TỰ ĐỘNG ĐỔI TRẠNG THÁI BÀN)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        
        // Logic: Khi đặt bàn thành công -> Bàn chuyển sang 'BOOKED' (Đã đặt)
        if (newOrder.tableNumber) {
            await Table.findOneAndUpdate(
                { tableNumber: newOrder.tableNumber }, 
                { status: 'BOOKED' }
            );
        }

        res.json(newOrder);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 4. Cập nhật Đơn hàng (Xử lý chuyển bàn thông minh)
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // BƯỚC 1: Lấy thông tin đơn hàng CŨ (Trước khi sửa)
        const oldOrder = await Order.findById(id);
        if (!oldOrder) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

        // BƯỚC 2: Kiểm tra xem có đổi bàn không?
        // Nếu số bàn gửi lên KHÁC số bàn cũ -> Có đổi bàn
        if (updateData.tableNumber && updateData.tableNumber !== oldOrder.tableNumber) {
            
            // a. Trả tự do cho bàn CŨ (Set về EMPTY)
            if (oldOrder.tableNumber) {
                await Table.findOneAndUpdate(
                    { tableNumber: oldOrder.tableNumber }, 
                    { status: 'EMPTY' }
                );
                console.log(`♻️ Đã trả bàn cũ: ${oldOrder.tableNumber} về EMPTY`);
            }

            // b. Cập nhật trạng thái cho bàn MỚI (Set về BOOKED hoặc OCCUPIED tùy status đơn)
            // Nếu đơn đang CONFIRMED (Đang ăn) thì bàn mới là OCCUPIED
            // Nếu đơn đang Waiting (Chờ) thì bàn mới là BOOKED
            const newStatus = (updateData.status === 'CONFIRMED' || oldOrder.status === 'CONFIRMED') 
                              ? 'OCCUPIED' : 'BOOKED';
            
            await Table.findOneAndUpdate(
                { tableNumber: updateData.tableNumber },
                { status: newStatus }
            );
            console.log(`✅ Đã cập nhật bàn mới: ${updateData.tableNumber} thành ${newStatus}`);
        }

        // BƯỚC 3: Xử lý nếu chỉ đổi Trạng thái đơn (Duyệt/Hủy/Xong) mà không đổi bàn
        // (Logic cũ vẫn giữ để xử lý các nút bấm trạng thái)
        if (updateData.status && updateData.status !== oldOrder.status) {
            const targetTable = updateData.tableNumber || oldOrder.tableNumber;
            if (targetTable) {
                if (updateData.status === 'CONFIRMED') {
                    await Table.findOneAndUpdate({ tableNumber: targetTable }, { status: 'OCCUPIED' });
                } else if (updateData.status === 'CANCELLED' || updateData.status === 'COMPLETED') {
                    await Table.findOneAndUpdate({ tableNumber: targetTable }, { status: 'EMPTY' });
                }
            }
        }

        // BƯỚC 4: Lưu thông tin mới vào Order
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ message: "Cập nhật thành công!", data: updatedOrder });

    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: e.message }); 
    }
});

// =========================================================
// PHẦN 5: QUẢN LÝ KHUYẾN MÃI (PROMOTIONS)
// =========================================================

const PromotionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Mã KM (VD: SUMMER2025)
    discountPercent: { type: Number, required: true },    // Giảm bao nhiêu %
    isActive: { type: Boolean, default: true }            // Trạng thái (Áp dụng/Ngừng)
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', PromotionSchema, 'promotions');

// --- API PROMOTIONS ---

// 1. Lấy danh sách khuyến mãi
app.get('/api/promotions', async (req, res) => {
    try {
        const list = await Promotion.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 2. Thêm khuyến mãi mới
app.post('/api/promotions', async (req, res) => {
    try {
        const { code, discountPercent, isActive } = req.body;
        
        // Kiểm tra xem mã này đã có chưa
        const exist = await Promotion.findOne({ code: code.toUpperCase() });
        if (exist) return res.status(400).json({ error: "Mã khuyến mãi này đã tồn tại!" });

        const newPromo = new Promotion({
            code: code.toUpperCase(), // Tự động viết hoa
            discountPercent,
            isActive: isActive !== undefined ? isActive : true
        });
        await newPromo.save();
        res.json(newPromo);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 3. Cập nhật khuyến mãi (Sửa)
app.put('/api/promotions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Nếu có sửa mã thì viết hoa lên
        if (updateData.code) updateData.code = updateData.code.toUpperCase();
        
        const updated = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 4. Xóa khuyến mãi
app.delete('/api/promotions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Promotion.findByIdAndDelete(id);
        res.json({ message: "Đã xóa khuyến mãi!" });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 5. Lấy đơn hàng ACTIVE theo Số bàn (Dùng cho nút "Sửa món" bên Bàn ăn)
// Chỉ lấy đơn đang ở trạng thái: Waiting (Chờ) hoặc CONFIRMED (Đang ăn)
app.get('/api/orders/active/:tableNumber', async (req, res) => {
    try {
        const { tableNumber } = req.params;
        
        // Tìm đơn hàng của bàn này mà chưa hoàn thành/hủy
        const activeOrder = await Order.findOne({
            tableNumber: tableNumber,
            status: { $in: ['Waiting', 'CONFIRMED'] }
        }).sort({ createdAt: -1 }); // Lấy cái mới nhất nếu lỡ có nhiều cái trùng

        if (!activeOrder) {
            return res.status(404).json({ message: "Bàn này hiện chưa có đơn nào!" });
        }

        res.json(activeOrder);
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// 6. [MỚI] API Kiểm tra mã khuyến mãi
app.get('/api/promotions/check/:code', async (req, res) => {
    try {
        if (!req.params.code) return res.status(400).json({ message: "Chưa nhập mã!" });
        
        const code = req.params.code.trim().toUpperCase(); 
        
        console.log("🔍 Server đang tìm mã:", code);

        // Check mã coi đúng không và còn active không 
        const promo = await Promotion.findOne({ 
            code: code, 
            isActive: true 
        });

        if (!promo) {
            console.log("❌ Không tìm thấy mã trong DB!");
            return res.status(404).json({ message: "Mã không tồn tại hoặc đã ngưng hoạt động!" });
        }

        console.log("✅ Đã tìm thấy:", promo);
        res.json(promo); 
    } catch (e) { 
        console.error("🔥 LỖI API CHECK CODE:", e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`));