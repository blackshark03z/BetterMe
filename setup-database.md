# Database Setup Guide

## Bước 1: Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```
EXPO_PUBLIC_SUPABASE_URL=https://czmxxlsnmbocldqwqwuu.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8
```

## Bước 2: Setup Database trong Supabase Dashboard

1. Đăng nhập vào [supabase.com](https://supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy và paste nội dung từ file `supabase/migrations/003_complete_setup.sql`
5. Chạy script

**Lưu ý**: Script này có thể chạy nhiều lần mà không bị lỗi, vì nó sử dụng `IF NOT EXISTS` và `DROP IF EXISTS`.

## Bước 3: Kiểm tra Database

Sau khi chạy script, bạn sẽ có:

### Tables được tạo:
- `users` - Thông tin người dùng
- `workout_plans` - Kế hoạch tập luyện
- `progress_logs` - Log tiến độ

### Row Level Security (RLS):
- Mỗi user chỉ có thể truy cập dữ liệu của mình
- Tự động tạo user profile khi đăng ký

### Triggers:
- Tự động cập nhật `updated_at` timestamp
- Tự động tạo user profile khi đăng ký

## Bước 4: Test Database

Bạn có thể test bằng cách:

1. Chạy app: `npm start`
2. Thử đăng ký user mới
3. Kiểm tra trong Supabase Dashboard > Table Editor > users

## Troubleshooting

### Nếu gặp lỗi "relation does not exist":
- Đảm bảo đã chạy script SQL trong Supabase SQL Editor
- Kiểm tra xem có lỗi syntax nào không

### Nếu gặp lỗi RLS:
- Đảm bảo đã enable RLS cho tất cả tables
- Kiểm tra policies đã được tạo đúng

### Nếu gặp lỗi authentication:
- Kiểm tra credentials trong file .env
- Đảm bảo URL và ANON_KEY đúng 