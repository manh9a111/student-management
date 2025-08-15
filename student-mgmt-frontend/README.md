# Student Management Frontend (Next.js App Router)

Frontend kết nối sẵn API backend (JWT). Đã có:
- Trang đăng nhập `/login`
- Danh sách + tìm kiếm + phân trang
- Thêm mới, xem/sửa, xoá sinh viên

## Cài đặt
```bash
npm i
cp .env.local.example .env.local
# Sửa NEXT_PUBLIC_API_BASE nếu backend khác cổng
```

## Chạy dev
```bash
npm run dev
# http://localhost:3000
```

## Ghi chú
- Token JWT được lưu vào `localStorage` sau khi đăng nhập.
- Fetch API có wrapper ở `lib/api.js` tự gắn Authorization header.
- UI dùng Tailwind (đã cấu hình sẵn).
