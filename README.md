# Tool OKRs

Code 1 API nhỏ nhắn xinh xắn nhưng không hề đáng yêu về tool OKRs cho các Start Up nhỏ sử dụng!

**Đây là code base cho các App sau này của AE mình**

```bash
Nên ai có đóng góp gì thì mong các bạn tạo issue để cải thiện hơn ạ 🥳
```

## Cách run project

1. Bật Docker lên, nếu chưa có thì tải [ở đây](https://www.docker.com/products/docker-desktop)

2. Tạo thêm file mới ở root project tên là `.env` và lấy dữ liệu copy từ file `.env.example`

3. Chạy project với command line sau

```bash
docker-compose up
```

4. Run migration DB vào container Postgres Database

```bash
yarn migration:run
```

5. Ok, ngon rồi, bây giờ thì test API các thứ thôi! Nhớ thêm vào **Header** mục **Authorization** với **Bearer Token** từ khi Login vào nhé 😎

## Thành viên tham gia

| Tên              | Link Github                                       |
| ---------------- | ------------------------------------------------- |
| Trần Quang Nhật  | [harrytran998](https://github.com/harrytran998)   |
| Phan Văn Đức     | [phanduc0908](https://github.com/phanduc0908)     |
| Nguyễn Văn Quang | [quangnv281098](https://github.com/quangnv281098) |
| Ngô Minh Đức     | [ducnmhe130666](https://github.com/ducnmhe130666) |
