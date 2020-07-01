[![Codacy Badge](https://app.codacy.com/project/badge/Grade/548555718f5b4f099c33bb35dc09d7c1)](https://www.codacy.com/gh/Olympus-Team/OKRs-enterprise-api?utm_source=github.com&utm_medium=referral&utm_content=Olympus-Team/OKRs-enterprise-api&utm_campaign=Badge_Grade)
[![License](https://img.shields.io/github/license/olympus-team/okrs-enterprise-api?color=%237159c1&logo=mit)](https://github.com/olympus-team/okrs-enterprise-api/blob/develop/license)
[![Contributors](https://img.shields.io/github/contributors/Olympus-Team/OKRs-enterprise-api?color=%237159c1&logoColor=%237159c1&style=flat)](https://github.com/Olympus-Team/OKRs-enterprise-api/graphs/contributors)

<h2 align="center">
Tool OKRs - NestJS + TypeORM + PostgresQL
</h2>

<p align="center">Code 1 API nhỏ nhắn xinh xắn nhưng không hề đáng yêu về tool OKRs cho các Start Up nhỏ sử dụng! Ai có đóng góp gì thì mong các bạn tạo issue để cải thiện hơn ạ 🥳</p>

<hr>

## Participants

| [<img src="https://avatars1.githubusercontent.com/u/24296018?s=460&u=6575a1785649a40e12d9593c46178b8fa36c3c9d&v=4" width="75px;"/>](https://github.com/harrytran998) | [<img src="https://avatars2.githubusercontent.com/u/29729545?s=460&u=b55c3313acc6c65df4be632f1a38e32d50b6cbfb&v=4" width="75px;"/>](https://github.com/phanduc0908) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


| [Harry Tran](https://github.com/harrytran998) | [Van Duc](https://github.com/phanduc0908) |

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
