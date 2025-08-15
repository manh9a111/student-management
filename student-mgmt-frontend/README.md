
# Quản Lý Sinh Viên — Fullstack (Next.js + Express + MongoDB)

Dự án gồm **Backend (Node.js/Express)** và **Frontend (Next.js App Router)** đã cấu hình sẵn để kết nối với nhau qua JWT.

> Gợi ý cổng dùng trong tài liệu: **Backend = 5050**, **Frontend = 3000**.

---

## 1) Cấu trúc thư mục

```
student-mgmt-backend/       # API Express + MongoDB
  .env.example
  server.js
  src/
    db.js
    middleware/auth.js
    models/
      Student.js
      User.js
    routes/
      auth.js
      students.js
  scripts/
    seed.js
    resetAdmin.js (tự tạo nếu dùng cách reset bên dưới)
  seed.json
  StudentMgmt.postman_collection.json

student-mgmt-frontend/      # Next.js (App Router)
  .env.local.example
  next.config.js
  app/
    layout.js
    page.js
    login/page.js
    students/
      new/page.js
      [id]/page.js
  lib/api.js
  components/NavBar.js
  app/globals.css
```

---

## 2) Chuẩn bị môi trường

### 2.1 MongoDB
- **Homebrew (macOS):**
  ```bash
  brew services start mongodb-community
  ```
- **Hoặc Docker:**
  ```bash
  docker run -d --name mongo -p 27017:27017 mongo:7
  ```

### 2.2 Node.js
- Node.js >= 18

---

## 3) Backend (Express + MongoDB)

### 3.1 Cấu hình
```bash
cd student-mgmt-backend
cp .env.example .env
# Mở .env và chỉnh (ví dụ):
# PORT=5050
# MONGO_URI=mongodb://localhost:27017/students
# JWT_SECRET=supersecret
```

### 3.2 Cài đặt & chạy
```bash
npm i
npm run dev
# Log kỳ vọng:
# [DB] connected
# [API] listening on http://localhost:5050
```

### 3.3 Kiểm tra nhanh
```bash
curl http://localhost:5050/api/health
# => {"status":"ok"}
```

### 3.4 Seed dữ liệu (students)
```bash
npm run seed
# chỉ seed Student, KHÔNG tạo user
```

### 3.5 Tạo tài khoản admin (chọn 1 trong 2 cách)

**Cách A — qua curl:**
```bash
curl -X POST "http://localhost:5050/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456","role":"admin"}'

curl -X POST "http://localhost:5050/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
# Nhận về: { "token": "..." }
```

**Cách B — reset bằng script (tạo file nếu chưa có):**
```js
// student-mgmt-backend/scripts/resetAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/students';

(async () => {
  await mongoose.connect(MONGO_URI);
  let u = await User.findOne({ username: 'admin' });
  if (!u) {
    u = new User({ username: 'admin', role: 'admin' });
    await u.setPassword('123456');
    await u.save();
    console.log('Created admin: admin / 123456');
  } else {
    await u.setPassword('123456');
    await u.save();
    console.log('Reset admin password to 123456');
  }
  await mongoose.disconnect();
  process.exit(0);
})();
```
Chạy:
```bash
node scripts/resetAdmin.js
```

### 3.6 API chính
- `POST /api/auth/register` — tạo user (dev)
- `POST /api/auth/login` — trả `{ token }`
- `GET /api/students?keyword=&page=1&limit=10` — danh sách (Bearer token)
- `GET /api/students/:id` — chi tiết (Bearer token)
- `POST /api/students` — tạo (Bearer token)
- `PUT /api/students/:id` — cập nhật (Bearer token)
- `DELETE /api/students/:id` — xoá (Bearer token)

> **Postman**: import `StudentMgmt.postman_collection.json`, set `{{base}} = http://localhost:5050`, `{{token}}` sau khi login.

---

## 4) Frontend (Next.js App Router)

### 4.1 Cấu hình endpoint
```bash
cd student-mgmt-frontend
cp .env.local.example .env.local
# Mở .env.local và đặt:
# NEXT_PUBLIC_API_BASE=http://localhost:5050/api
```

> **Tuỳ chọn (proxy, đỡ lo CORS):** sửa `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://localhost:5050/api/:path*' }];
  },
};
module.exports = nextConfig;
```
và đặt `.env.local`:
```
NEXT_PUBLIC_API_BASE=/api
```

### 4.2 Cài đặt & chạy
```bash
npm i
npm run dev
# http://localhost:3000
```

### 4.3 Luồng sử dụng
1) Vào `/login` → đăng nhập `admin / 123456` (sau khi đã tạo user).  
2) Trang chủ hiển thị danh sách + tìm kiếm + phân trang.  
3) Thêm mới: `/students/new`.  
4) Xem/Sửa/Xoá: `/students/[id]`.  

---

## 5) Biến môi trường

### Backend (`.env`)
- `PORT` — cổng API (vd: 5050)
- `MONGO_URI` — chuỗi kết nối MongoDB
- `JWT_SECRET` — khoá ký JWT

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_BASE` — URL gốc API (vd: `http://localhost:5050/api` hoặc `/api` khi dùng proxy rewrites)

---

## 6) Troubleshooting (hay gặp)

- **EADDRINUSE: cổng bận**  
  Đổi `PORT` trong backend (vd: 5050) và cập nhật `NEXT_PUBLIC_API_BASE` tương ứng.  
  Khởi động lại cả backend và frontend sau khi đổi.

- **Không thể kết nối server / Network Error**  
  - Backend có chạy và log `[API] listening on http://localhost:5050` chưa?  
  - `http://localhost:5050/api/health` có trả `{"status":"ok"}` không?  
  - `.env.local` frontend đã đúng và **restart** `npm run dev` sau khi chỉnh?

- **401 khi đăng nhập**  
  Chưa có user hoặc sai mật khẩu → tạo admin theo mục 3.5.

- **Lỗi CORS trên trình duyệt**  
  - Backend đã `app.use(cors())`.  
  - Hoặc dùng **proxy rewrites** trong Next.js (mục 4.1).

- **MongoDB không chạy**  
  - Homebrew: `brew services start mongodb-community`  
  - Docker: `docker run -d --name mongo -p 27017:27017 mongo:7`

- **11000 duplicate key (studentCode)**  
  `studentCode` là unique. Đổi mã SV khác hoặc xoá bản ghi trùng.

---

## 7) Mở rộng gợi ý
- Phân quyền UI theo `role` (ẩn/xám hoá nút xoá với `staff`).
- Import/Export CSV.
- Upload ảnh thẻ SV (S3/Cloudinary).
- Audit log lịch sử chỉnh sửa.
- Validate form (Yup/React Hook Form) + toast thông báo.

---

## 8) Lệnh nhanh tổng hợp

```bash
# Backend
cd student-mgmt-backend
cp .env.example .env
npm i
npm run dev
curl http://localhost:5050/api/health

# Tạo admin
curl -X POST "http://localhost:5050/api/auth/register" -H "Content-Type: application/json" -d '{"username":"admin","password":"123456","role":"admin"}'
curl -X POST "http://localhost:5050/api/auth/login"    -H "Content-Type: application/json" -d '{"username":"admin","password":"123456"}'

# Seed students
npm run seed

# Frontend
cd ../student-mgmt-frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_API_BASE=http://localhost:5050/api
npm i
npm run dev
```
