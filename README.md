PayME SDK là bộ thư viện để các app có thể tương tác với PayME Platform. PayME SDK bao gồm các chức năng chính như sau:
-   Hệ thống đăng ký, đăng nhập, eKYC thông qua tài khoản ví PayME
-   Chức năng nạp rút chuyển tiền từ ví PayME.
-   Tích hợp các dịch vụ của PayME Platform.

**Một số thuật ngữ**

|  | Name | Giải thích |
|--|--|--|
| 1 | app | Là app mobile iOS/Android hoặc web sẽ tích hợp SDK vào để thực hiện chức năng thanh toán ví PayME |
| 2 | SDK | Là bộ công cụ hỗ trợ tích hợp ví PayME vào hệ thống app. |
| 3 | backend | Là hệ thống tích hợp hỗ trợ cho app, server hoặc api hỗ trợ |
| 4 | AES | Hàm mã hóa dữ liệu AES. [Tham khảo](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) |
| 5 | RSA| Thuật toán mã hóa dữ liệu RSA. |
| 6 | IPN |Instant Payment Notification , dùng để thông báo giữa hệ thống backend của app và backend của PayME|

## Cài đặt

-   npm:
`npm install web-payme-sdk`

-   yarn:
`yarn add web-payme-sdk`


## Usage
Hệ thống PayME sẽ cung cấp cho app tích hợp các thông tin sau:

-   **PublicKey**  : Dùng để mã hóa dữ liệu, app tích hợp cần truyền cho SDK để mã hóa.
-   **AppToken**  : AppId cấp riêng định danh cho mỗi app, cần truyền cho SDK để mã hóa
-   **SecretKey**  : Dùng đã mã hóa và xác thực dữ liệu ở hệ thống backend cho app tích hợp.

Bên App sẽ cung cấp cho hệ thống PayME các thông tin sau:

-   **AppPublicKey**  : Sẽ gửi qua hệ thống backend của PayME dùng để mã hóa.
-   **AppPrivateKey**: Sẽ truyền vào PayME SDK để thực hiện việc giải mã.

Chuẩn mã hóa: RSA-512bit.

### Khởi tạo thư viện
Trước khi sử dụng PayME SDK cần import component SDK và ref để sử dụng các chức năng.
- Khi sử dụng tài khoản khác cần cập nhật lại param configs

```javascript
import React, { Component, useRef } from 'react'
import WebPaymeSDK from 'web-payme-sdk'

class Example extends Component {
  const refWebPaymeSDK = useRef(null)
  const configs = {
      appToken,
      deviceId,
      publicKey,
      privateKey,
      env, 
      appId,
      partner,
      configColor
   }
  render() {
    return <WebPaymeSDK configs={configs} ref={refWebPaymeSDK} propStyle={propStyle} />
  }
}
```

#### Parameters
| Property | Type | Required | Description |
| -------------- | ---------- | -------- |  ------------------------------------------------------------ |
| `propStyle` | `object` | No | Custom style cho component |
| `appToken` | `string` | Yes | AppId cấp riêng định danh cho mỗi app, cần truyền cho SDK để mã hóa. |
| `publicKey` | `string` | Yes | Dùng để mã hóa dữ liệu, app tích hợp cần truyền cho SDK để mã hóa. Do hệ thống PayME cung cấp cho app tích hợp. |
| `privateKey` | `string` | Yes | app cần truyền vào để giải mã dữ liệu. Bên app sẽ cung cấp cho hệ thống PayME. |
| `deviceId` | `string` |Yes | Là deviceId của thiết bị |
| `env` | `string` | Yes |Là môi trường sử dụng SDK (sandbox, production) |
| `appId` | `string` | Yes |Là appID khi đăng ký merchant sdk sẽ được hệ thống tạo cho |
| `partner` | `object` | Yes | <pre lang="json">{<br>   paddingTop: Tùy biến vị trí góc trên cùng khi thiết bị trên app có tùy biến header-statusbar<br>}</pre> |
| `configColor` | `string[]` | Yes | configColor : là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào. | 

[![img](https://github.com/PayME-Tech/PayME-SDK-Android-Example/raw/main/fe478f50-e3de-4c58-bd6d-9f77d46ce230.png?raw=true)](https://github.com/PayME-Tech/PayME-SDK-Android-Example/blob/main/fe478f50-e3de-4c58-bd6d-9f77d46ce230.png?raw=true)

### Mã lỗi của PayME SDK
| Hằng số | Mã lỗi | Giải thích 
| -------------- | ---------- | -------- |
| `EXPIRED` | `401` | token hết hạn sử dụng |
| `NETWORK` | `-1` |  Kết nối mạng bị sự cố |
| `SYSTEM` | `-2` |  Lỗi hệ thống |
| `LIMIT` | `-3` |  app cần truyền vào để giải mã dữ liệu. Bên app sẽ cung cấp cho hệ thống PayME. |
| `NOT_ACTIVED` | `-4` | Lỗi tài khoản chưa kích hoạt |
| `NOT_KYC` | `-5` | Lỗi tài khoản chưa định danh |
| `PAYMENT_ERROR` | `-6` | Thanh toán thất bại |
| `ERROR_KEY_ENCODE` | `-7` | Lỗi mã hóa/giải mã dữ liệu |
| `USER_CANCELLED` | `-8` | Người dùng thao tác hủy | 
| `NOT_LOGIN` | `-9` | Lỗi tài khoản chưa login | 
| `CLOSE_IFRAME` | `-10` | Đóng Iframe | 
| `BALANCE_ERROR` | `-11` | Lỗi số dư ví không đủ | 
| `UNKNOWN_PAYCODE` | `-12` | Lỗi thiếu thông tin payCode | 

### Các chức năng của PayME SDK
#### login()
Có 2 trường hợp

-   Dùng để login lần đầu tiên ngay sau khi khởi tạo PayME.
    
-   Dùng khi accessToken hết hạn, khi gọi hàm của SDK mà trả về mã lỗi ERROR_CODE.EXPIRED, lúc này app cần gọi login lại để lấy accessToken dùng cho các chức năng khác.
    
Sau khi gọi login() thành công rồi thì mới gọi các chức năng khác của SDK ( openWallet, pay, ... )

```javascript
const configsLogin = {
   ...configs,
   connectToken,
   phone
}
refWebPaymeSDK.current.login(
   configsLogin,
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```

#### Constant
| Property | Type | Description |
| ------------------ | ------ | ---------------------- |
| `ENV.SANDBOX` | `enum` | Môi trường sandbox. |
| `ENV.PRODUCTION` | `enum` | Môi trường production. |

#### Parameters
| Property | Type | Description |
| -------------- | ---------- | ------------------------------------------------------------ |
| `connectToken` | `string` | app cần truyền giá trị được cung cấp ở trên, xem cách tạo bên dưới. |
| `phone` | `string` | Số điện thoại của hệ thống tích hợp |

Cách tạo **connectToken**:
connectToken cần để truyền gọi api từ tới PayME và sẽ được tạo từ hệ thống backend của app tích hợp. Cấu trúc như sau:
```javascript
import crypto from 'crypto'
const data = {
  timestamp:  34343242342,
  userId :  "ABC",
  phone :  "0909998877"
}
const algorithm = `aes-256-cbc`
const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const iv = Buffer.from(ivbyte)
const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64')
const connectToken = encrypted + cipher.final('base64')
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :------------ | :----------- | :----------------------------------------------------------- |
| **timestamp** | Yes | Thời gian tạo ra connectToken theo định dạng iSO 8601 , Dùng để xác định thời gian timeout của connectToken. Ví dụ 2021-01-20T06:53:07.621Z |
| ***userId*** | Yes | là giá trị cố định duy nhất tương ứng với mỗi tài khoản khách hàng ở dịch vụ, thường giá trị này do server hệ thống được tích hợp cấp cho PayME SDK |
| ***phone*** | Yes | Số điện thoại của hệ thống tích hợp |

Trong đó ***AES*** là hàm mã hóa theo thuật toán AES. Tùy vào ngôn ngữ ở server mà bên hệ thống dùng thư viện tương ứng. Xem thêm tại đây https://en.wikipedia.org/wiki/Advanced_Encryption_Standard

#### getAccountInfo
App có thể dùng thuộc tính này sau khi khởi tạo SDK để biết được trạng thái liên kết tới ví PayME.
```javascript
refWebPaymeSDK.current.getAccountInfo(
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```
#### openWallet - Mở UI chức năng PayME tổng hợp
Hàm này được gọi khi từ app tích hợp khi muốn gọi 1 chức năng PayME bằng cách truyền vào tham số Action như trên.
```javascript
refWebPaymeSDK.current.openWallet(
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```

#### scanQR
Mở chức năng quét mã QR để thanh toán

⚠️⚠️⚠️ version 1.4.1 trở đi

```javascript
refWebPaymeSDK.current.scanQR(
   {
      payCode: String
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| payCode | Yes | `PAYME`, `CREDIT`, `ATM`, `MANUAL_BANK` (Xem thêm các phương thức khác ở phía dưới) |


Định dạng QR: 
```javascript
const qrString = "{$type}|${storeId}|${action}|${amount}|${note}|${orderId}"
``` 
- action: loại giao dịch ( 'PAYMENT' => thanh toán)
- amount: số tiền thanh toán
- note: Mô tả giao dịch từ phía đối tác
- orderId: mã giao dịch của đối tác, cần duy nhất trên mỗi giao dịch
- storeId: ID của store phía công thanh toán thực hiên giao dịch thanh toán
- type: OPENEWALLET

Ví dụ :
```javascript
const qrString = "OPENEWALLET|54938607|PAYMENT|20000|Chuyentien|2445562323"
```

#### payQRCode
Hàm dùng để thanh toán mã QR code do đối tác cung cấp

⚠️⚠️⚠️ version 1.4.1 trở đi

```javascript
refWebPaymeSDK.current.payQRCode(
   {
      qrContent: String,
      payCode: String,
      isShowResultUI: Boolean
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```
| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| qrContent | Yes| Nội dung QR Code |
| payCode | Yes | `PAYME`, `CREDIT`, `ATM`, `MANUAL_BANK` (Xem thêm các phương thức khác ở phía dưới) |
| isShowResultUI | No | Option hiển thị UI kết quả thanh toán. Default: true |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### deposit - Nạp tiền
```javascript
refWebPaymeSDK.current?.deposit(
   {
      amount: Number,
      closeWhenDone: Boolean
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
);
```
| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| amount | Yes| Dùng trong trường hợp action là Deposit/Withdraw thì truyền vào số tiền |
| closeWhenDone | No | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### withdraw - Nạp tiền
```javascript
refWebPaymeSDK.current?.withdraw(
   {
      amount: Number,
      closeWhenDone: Boolean
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
);
```
| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| amount | Yes| Dùng trong trường hợp action là Deposit/Withdraw thì truyền vào số tiền |
| closeWhenDone | No | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### transfer - Chuyển tiền
```javascript
refWebPaymeSDK.current?.transfer(
   {
      amount: Number,
      description: String
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
);
```
| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| amount | Yes| Dùng trong trường hợp action là Deposit/Withdraw/Transfer thì truyền vào số tiền |
| description | No| Nội dung chuyển tiền |
| closeWhenDone | No | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### getListService
App có thể dùng thược tính này sau khi khởi tạo SDK để biết danh sách các dịch vụ mà PayME đang cung cấp
```javascript
refWebPaymeSDK.current.getListService(
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```
#### openService
Hàm này được gọi khi từ app tích hợp khi muốn gọi 1 dịch vụ mà PayME cũng cấp bằng cách truyền vào tham số serviceCode như sau
```javascript
refWebPaymeSDK.current.openService(
   serviceCode,
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| serviceCode | Yes| Mã dịch vụ từ danh sách dịch vụ được lấy từ hàm getListService |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### getListPaymentMethod
Hàm này được gọi khi từ app tích hợp khi muốn lấy danh sách các phương thức thanh toán mà PayME cung cấp vs từng tài khoản sau khi tài khoản đã kích hoạt và định danh thành công, dùng để truyền vào hàm pay() để chọn trực tiếp phương thức thanh toán mà app đối tác muốn
```javascript
refWebPaymeSDK.current.getListPaymentMethod(
   { 
      storeId
   },
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
)
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| storeId | Yes| ID của store phía cổng thanh toán thực hiên giao dịch thanh toán. |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### pay - Thanh toán
Hàm này được dùng khi app cần thanh toán 1 khoản tiền từ ví PayME đã được kích hoạt.
- Khi thanh toán bằng ví PayME thì yêu cầu tài khoản đã kích hoạt,định danh và số dư trong ví phải lớn hơn số tiền thanh toán
- Thông tin tài khoản lấy qua hàm <code>getAccountInfo()</code>
- Thông tin số dư lấy qua hàm <code>getWalletInfo()</code>

⚠️⚠️⚠️ version 1.4.1 trở đi

```javascript
const  data = {
  amount:  Number,
  orderId:  String,
  storeId:  Number,
  extractData: String,
  note:  String,
  payCode: String,
  isShowResultUI: Boolean?,
}
refWebPaymeSDK.current.pay(
   data,
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
);
```
| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| amount | Yes | Số tiền cần thanh toán bên app truyền qua cho SDK. |
| note | No | Mô tả giao dịch từ phía đối tác. |
| orderId | Yes | Mã giao dịch của đối tác, cần duy nhất trên mỗi giao dịch. |
| storeId | Yes | ID của store phía cổng thanh toán thực hiên giao dịch thanh toán. |
| isShowResultUI | No | Option hiển thị UI kết quả thanh toán. Default: true |
| payCode | Yes | `PAYME`, `CREDIT`, `ATM`, `MANUAL_BANK` (Xem thêm các phương thức khác ở phía dưới) |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### getWalletInfo - Lấy các thông tin của ví
```javascript
refWebPaymeSDK.current.getWalletInfo(response => {
   (response) => {
      // onSuccess
   },
   (error) => {
      // onError
   }
})
```
```json
{
   "balance":  111,
   "cash":  1,
   "lockCash":  2
}
```
*balance*: App tích hợp có thể sử dụng giá trị trong key balance để hiển thị, các field khác hiện tại chưa dùng.

*detail.cash*: Tiền có thể dùng.

*detail.lockCash*: Tiền bị lock.

## Danh sách phương thức thanh toán
| **payCode** | **Phương thức thanh toán** |
| :------------| :-------------|
| PAYME  | Thanh toán ví PayME |
| ATM  | Thanh toán thẻ ATM Nội địa |
| MANUAL_BANK  | Thanh toán chuyển khoản ngân hàng |
| VN_PAY  | Thanh toán QR Code ngân hàng |
| CREDIT  | Thanh toán thẻ tín dụng |
| MOMO  | Thanh toán ví MoMo |
| ZALO_PAY  | Thanh toán ví ZaloPay |


## License
Copyright 2020 @ [PayME](payme.vn)
