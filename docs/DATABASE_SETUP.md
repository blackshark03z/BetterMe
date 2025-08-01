# Database Setup Guide

## 1. Supabase Project Setup

1. Tạo project mới trên [Supabase](https://supabase.com)
2. Lấy **Project URL** và **Anon Key** từ Settings > API
3. Thêm vào file `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 2. Database Schema

Project sử dụng các bảng chính:
- `users` - Thông tin user profile
- `workout_plans` - Kế hoạch tập luyện
- `progress_logs` - Log tiến độ

## 3. Chạy Migration

Chạy các file migration theo thứ tự trong Supabase SQL Editor:

1. **003_complete_setup.sql** - Tạo database schema cơ bản
2. **004_fix_auth.sql** - Fix authentication issues  
3. **005_fix_schema_cache.sql** - Fix schema cache issues
4. **006_align_with_context.sql** - Align với CONTEXT.md specification
5. **007_fix_schema_cache_final.sql** - Final fix for schema cache issues

**Lưu ý:** Migration `005_fix_schema_cache.sql` sẽ xóa và tạo lại bảng `users`, nên chỉ chạy khi cần thiết.

## 4. Authentication Settings

Trong Supabase Dashboard > Authentication > Settings:

1. **Disable email confirmation** (cho development)
2. **Add redirect URLs**:
   - `betterme://login`
   - `betterme://reset-password`

## 5. Test Database Connection

Chạy script test để kiểm tra kết nối:
```bash
node test-auth.js
```

## Troubleshooting

### Lỗi "Could not find column"
- Chạy migration `005_fix_schema_cache.sql`
- Clear browser cache và reload

### Lỗi RLS Policy
- Kiểm tra policies trong Supabase Dashboard
- Chạy lại migration nếu cần

### Lỗi Trigger
- Kiểm tra function `handle_new_user` trong SQL Editor
- Recreate trigger nếu cần 