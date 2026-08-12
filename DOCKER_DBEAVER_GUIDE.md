# Hướng Dẫn Quản Lý Dữ Liệu Với Docker, PostgreSQL và DBeaver

Tài liệu này hướng dẫn cách khởi chạy **PostgreSQL Database** bằng **Docker Compose**, kết nối và quản lý dữ liệu trực quan bằng **DBeaver**, cũng như chạy backend Spring Boot kết nối với PostgreSQL.

---

## 1. Thông Tin Kết Nối Database (Database Credentials)

| Thông số | Giá trị |
| :--- | :--- |
| **DBMS** | PostgreSQL 15 |
| **Host / Server** | `localhost` (hoặc `127.0.0.1`) |
| **Port** | `5432` |
| **Database Name** | `musicdb` |
| **Username** | `postgres` |
| **Password** | `postgres` |
| **Data Persistence** | Volume `postgres_data` (Dữ liệu vẫn được giữ nguyên khi restart container) |

---

## 2. Các Bước Khởi Chạy PostgreSQL Bằng Docker

Mở Terminal / PowerShell tại thư mục gốc dự án (`d:/music`) và chạy lệnh:

```bash
# Khởi chạy PostgreSQL container ở chế độ background
docker compose up -d

# Kiểm tra trạng thái container
docker compose ps
```

Nếu muốn dừng container:
```bash
docker compose stop
```

---

## 3. Hướng Dẫn Kết Nối DBeaver Với PostgreSQL

1. Mở ứng dụng **DBeaver** trên máy tính.
2. Chọn **Database** -> **New Database Connection** (hoặc nhấn nút phích cắm điện màu xanh có dấu cộng ở góc trên bên trái).
3. Trong danh sách CSDL, chọn **PostgreSQL** -> nhấn **Next**.
4. Nhập các thông tin kết nối:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `musicdb`
   - **Authentication**: **Database Native**
   - **Username**: `postgres`
   - **Password**: `postgres`
5. Nhấn nút **Test Connection** ở góc dưới bên trái:
   - *Lưu ý*: Nếu DBeaver yêu cầu tải PostgreSQL Driver, chọn **Download** để DBeaver tự động tải driver.
   - Khi hiện thông báo `Connected` thành công, nhấn **OK**.
6. Nhấn **Finish**.
7. Trong giao diện DBeaver (Cây thư mục bên trái):
   - Mở mở rộng: `musicdb` -> `Schemas` -> `public` -> `Tables`.
   - Tại đây bạn sẽ thấy các bảng dữ liệu do Spring Boot JPA tự động tạo như: `music_project`, `track`, `clip`, `note_event`, `ai_suggestion`, v.v.

---

## 4. Chạy Backend Spring Boot Với PostgreSQL

Mặc định, `application.yml` đã được cấu hình profile **`postgres`**. Khi khởi chạy Spring Boot backend:

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ tự động kết nối tới PostgreSQL container đang chạy tại `localhost:5432/musicdb`.

### (Tùy chọn) Chuyển Đổi Lại H2 Database In-Memory
Nếu muốn chạy tạm thời bằng H2 Database mà không cần Docker, bạn có thể truyền profile `h2`:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
