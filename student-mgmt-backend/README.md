# Student Management Backend (Node.js + Express + MongoDB)

API quản lý sinh viên, xác thực JWT.

## Yêu cầu
- Node.js >= 18
- MongoDB đang chạy local (hoặc connection string khác)

## Cài đặt
```bash
npm i
cp .env.example .env
# sửa MONGO_URI/JWT_SECRET nếu cần
```

## Chạy dev
```bash
npm run dev
# API tại http://localhost:5000
```

## Seed dữ liệu
```bash
# tạo dữ liệu mẫu từ seed.json
npm run seed
```

## Endpoints
- `POST /api/auth/register` (dev, tạo user)
- `POST /api/auth/login` → trả về `{ token }`
- `GET /api/students?keyword=&page=1&limit=10` (Bearer token)
- `GET /api/students/:id` (Bearer token)
- `POST /api/students` (Bearer token)
- `PUT /api/students/:id` (Bearer token)
- `DELETE /api/students/:id` (Bearer token)

## Postman
Import file `StudentMgmt.postman_collection.json`. Set `{{base}}`, `{{token}}`.
