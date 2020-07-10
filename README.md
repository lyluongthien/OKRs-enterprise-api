[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ae23ea88127f47e09fdb131cf0d8a9dd)](https://app.codacy.com/gh/Olympus-Team/OKRs-enterprise-api?utm_source=github.com&utm_medium=referral&utm_content=Olympus-Team/OKRs-enterprise-api&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/Olympus-Team/OKRs-enterprise-api/branch/develop/graph/badge.svg)](https://codecov.io/gh/Olympus-Team/OKRs-enterprise-api)
[![License](https://img.shields.io/github/license/olympus-team/okrs-enterprise-api?color=%237159c1&logo=mit)](https://github.com/olympus-team/okrs-enterprise-api/blob/develop/license)
[![Contributors](https://img.shields.io/github/contributors/Olympus-Team/OKRs-enterprise-api?color=%237159c1&logoColor=%237159c1&style=flat)](https://github.com/Olympus-Team/OKRs-enterprise-api/graphs/contributors)
[![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=Olympus-Team/OKRs-enterprise-api)](https://forthebadge.com)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/Olympus-Team/OKRs-enterprise-api)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

<h2 align="center">
Tool OKRs - NestJS + TypeORM + PostgresQL
</h2>

<p align="center">Code 1 API nhỏ nhắn xinh xắn nhưng không hề đáng yêu về tool OKRs cho các Start Up nhỏ sử dụng! Ai có đóng góp gì thì mong các bạn tạo issue để cải thiện hơn ạ 🥳</p>

<hr>

## Thành viên

| [<img src="https://avatars1.githubusercontent.com/u/24296018?s=460&u=6575a1785649a40e12d9593c46178b8fa36c3c9d&v=4" width="61px;"/>](https://github.com/harrytran998) | [<img src="https://avatars2.githubusercontent.com/u/29729545?s=460&u=b55c3313acc6c65df4be632f1a38e32d50b6cbfb&v=4" width="61px;"/>](https://github.com/phanduc0908) | [<img src="https://avatars2.githubusercontent.com/u/43802661?s=460&u=a90ca7fdf0440a665a4ca8331977d31e65387ec0&v=4" width="61px;"/>](https://github.com/ducnmhe130666) | [<img src="https://avatars3.githubusercontent.com/u/56639191?s=460&u=cb7ed861febf2045444999b2d64e4a90082fc251&v=4" width="61px;"/>](https://github.com/quangnv281098) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


| [Harry Trần](https://github.com/harrytran998) | [Văn Đức](https://github.com/phanduc0908) | [Minh Đức](https://github.com/ducnmhe130666) | [Văn Quang](https://github.com/quangnv281098)

## Cách run project

### ⚠️ Yêu cầu trước khi run project

1. Có Docker Desktop bản stable
2. NodeJS phiên bản LTS(hiện tại là 12.18.1)
3. Cài đặt Yarn
4. Laptop/PC ram ít nhất 8GB

### Các bước chạy

1. Bật Docker lên, nếu chưa có thì tải [ở đây](https://www.docker.com/products/docker-desktop)

2. Tạo thêm file mới ở root project tên là `.env` và lấy dữ liệu copy từ file `.env.example`

3. Run Docker Compose để chạy ngầm PostgresQL

```bash
docker-compose up -d
```

4. Tải dependencies của app về

```bash
yarn
```

4. Run migration DB vào container Postgres Database

```bash
yarn migration:run
```

5. Ok, ngon rồi, bây giờ thì test API các thứ thôi! Nhớ thêm vào **Header** mục **Authorization** với **Bearer Token** từ khi Login vào nhé 😎
