# 4SK OPEN CHAMPIONSHIPS — Form đăng ký giải đấu

Form đăng ký thi đấu (Solo / Team) cho cộng đồng Discord 4SK, tự động ghi dữ liệu vào Google Sheet.

## Nội dung repo

```
index.html   → Trang form đăng ký (HTML/CSS/JS thuần, không cần build)
Code.gs      → Script backend chạy trên Google Apps Script, ghi dữ liệu vào Sheet
README.md    → File hướng dẫn này
```

---

## 1. Đưa trang lên GitHub Pages (lấy link công khai)

1. Tạo một repo mới trên GitHub (public), ví dụ: `4sk-open-championships`.
2. Upload 2 file `index.html` và `Code.gs` vào repo (file `Code.gs` chỉ để lưu trữ, không ảnh hưởng đến trang web).
3. Vào **Settings → Pages** của repo.
4. Ở mục **Source**, chọn nhánh `main` (hoặc `master`) và thư mục `/ (root)`, bấm **Save**.
5. Đợi khoảng 1 phút, GitHub sẽ cấp cho bạn link dạng:
   ```
   https://<tên-user-github>.github.io/4sk-open-championships/
   ```
6. Mở link đó ra là thấy form (lúc này form chưa gửi được dữ liệu — cần làm bước 2 bên dưới).

---

## 2. Kết nối form với Google Sheet (Google Apps Script)

### Bước 1 — Tạo Google Sheet

1. Vào [sheets.google.com](https://sheets.google.com), tạo một spreadsheet mới, đặt tên tuỳ ý (ví dụ: `4SK Open Championships - Đăng ký`).
2. Không cần tạo sẵn cột tiêu đề — script sẽ tự tạo 2 sheet con `Solo` và `Team` kèm tiêu đề khi có người đăng ký đầu tiên ở mỗi hình thức.

### Bước 2 — Gắn Apps Script vào Sheet

1. Trong Google Sheet vừa tạo, vào menu **Tiện ích mở rộng (Extensions) → Apps Script**.
2. Xoá hết code mẫu (`function myFunction() {...}`) trong file `Code.gs` mặc định.
3. Copy toàn bộ nội dung file `Code.gs` trong repo này, dán vào.
4. Bấm biểu tượng 💾 **Save** (hoặc `Ctrl/Cmd + S`).

### Bước 3 — Triển khai (Deploy) thành Web App

1. Góc trên bên phải, bấm **Deploy → New deployment**.
2. Bấm biểu tượng ⚙️ cạnh "Select type", chọn **Web app**.
3. Điền:
   - **Description**: `4SK registration receiver` (tuỳ ý)
   - **Execute as**: `Me (tài khoản của bạn)`
   - **Who has access**: `Anyone` — **bắt buộc** chọn mục này, nếu không form sẽ không gửi được dữ liệu vì người điền form không đăng nhập Google.
4. Bấm **Deploy**.
5. Lần đầu deploy, Google sẽ yêu cầu **Authorize access**:
   - Chọn tài khoản Google của bạn.
   - Nếu hiện cảnh báo "Google hasn't verified this app", bấm **Advanced → Go to (tên project) (unsafe)** rồi **Allow**. Đây là cảnh báo bình thường vì đây là script cá nhân bạn tự viết, không phải app công khai.
6. Sau khi deploy xong, Google sẽ cho bạn một **Web app URL** dạng:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   Copy URL này lại.

> ⚠️ Lưu ý: mỗi lần bạn **sửa nội dung `Code.gs`**, bạn phải vào **Deploy → Manage deployments → bấm biểu tượng bút chì (Edit) → Version: New version → Deploy** để cập nhật, thì thay đổi mới có hiệu lực. Sửa code mà không tạo version mới thì Web App vẫn chạy bản cũ.

### Bước 4 — Gắn URL vào `index.html`

1. Mở file `index.html`, tìm đoạn:
   ```js
   const CONFIG = {
     SCRIPT_URL: 'DÁN_URL_GOOGLE_APPS_SCRIPT_VÀO_ĐÂY'
   };
   ```
2. Thay `'DÁN_URL_GOOGLE_APPS_SCRIPT_VÀO_ĐÂY'` bằng Web app URL bạn vừa copy ở Bước 3, ví dụ:
   ```js
   const CONFIG = {
     SCRIPT_URL: 'https://script.google.com/macros/s/AKfycb.../exec'
   };
   ```
3. Lưu file, commit và push lên GitHub (hoặc upload đè file `index.html` mới lên repo).
4. Đợi GitHub Pages build lại (thường vài chục giây đến 1-2 phút), sau đó mở lại link Pages để test.

### Bước 5 — Test thử

1. Mở link GitHub Pages của bạn.
2. Điền thử form (Solo hoặc Team), tick đồng ý quy định, bấm **Gửi đăng ký**.
3. Mở lại Google Sheet — sẽ thấy sheet con `Solo` hoặc `Team` xuất hiện với dữ liệu vừa gửi.
4. Nếu gửi lỗi, form sẽ hiện thông báo lỗi màu đỏ phía trên nút gửi — kiểm tra lại:
   - URL trong `CONFIG.SCRIPT_URL` đã đúng và có `/exec` ở cuối chưa.
   - Bước deploy đã chọn **Who has access: Anyone** chưa.
   - Nếu vừa sửa `Code.gs`, đã **Deploy phiên bản mới** chưa (xem lưu ý ở Bước 3).

---

## 3. Cấu trúc dữ liệu ghi vào Sheet

**Sheet `Solo`**: Thời gian, Tên/Biệt danh, In-Game Name, Discord ID

**Sheet `Team`**: Thời gian, Tên đội, Đội trưởng (Tên/IGN/Discord), danh sách thành viên gộp thành 1 cột dạng `Tên (IGN / Discord) | Tên (IGN / Discord)...`, và số lượng thành viên.

Muốn tách mỗi thành viên thành 1 hàng riêng thay vì gộp chung 1 cột thì có thể sửa hàm `writeTeamRow()` trong `Code.gs` để `appendRow` cho từng phần tử trong `data.members`.

---

## 4. Những chỗ đã chỉnh sửa so với bản gốc

- **Validate dữ liệu trước khi gửi**: trước đây form chỉ yêu cầu tick ô đồng ý quy định là bấm gửi được, dù để trống hết các trường tên/IGN/Discord. Đã thêm kiểm tra bắt buộc điền đủ thông tin theo đúng hình thức thi đấu (Solo hoặc Team, bao gồm cả từng thành viên trong đội) trước khi cho gửi.
- **Kết nối Google Sheet thật**: trước đây bấm "Gửi đăng ký" chỉ đổi giao diện sang màn hình thành công, dữ liệu không đi đâu cả (đúng như dòng chữ "bản demo giao diện" ghi ở dưới nút gửi). Giờ dữ liệu được gửi thật lên Google Sheet qua Apps Script, có xử lý trạng thái "Đang gửi...", báo lỗi nếu gửi thất bại, và chỉ hiện màn hình thành công khi Sheet xác nhận đã ghi được.
- **Chống spam cơ bản**: thêm 1 trường ẩn (honeypot) — người dùng thật không thấy và không điền, nếu có dữ liệu trong đó (thường do bot tự động điền) thì hệ thống sẽ chặn không gửi.
- Các phần giao diện, hiệu ứng, bố cục gốc được giữ nguyên hoàn toàn.

---

## 5. Gợi ý mở rộng (tuỳ chọn, không bắt buộc)

- Thêm cột "Bảng đấu" / "Bộ môn thi đấu" nếu giải có nhiều tựa game khác nhau.
- Gửi thông báo qua Discord Webhook mỗi khi có người đăng ký mới (thêm `UrlFetchApp.fetch()` gọi Discord webhook trong `Code.gs`).
- Chặn đăng ký trùng bằng cách kiểm tra Discord ID đã tồn tại trong Sheet trước khi ghi dòng mới.
