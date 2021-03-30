
## Usage
Đặt thẻ `<scripts>`  sau đây gần cuối các trang của bạn, ngay trước thẻ đóng `</body>`, để kích hoạt SDK.

**CDN via jsDelivr**
```javascript
<script src="https://cdn.jsdelivr.net/gh/PayME-Tech/WebSDKIntegration@3.0/payme-sdk.min.js"></script>
   ```
**Đăng kí Merchant**
- Bước 1: Vào đăng ký Merchant theo trang đăng kí
- Bước 2: Đăng kí kết nối SDK
	- Tự genarate ra 1 bộ publicKey-privateKey
	- Dùng puclicKey của bussiness + privateKey tự generate vào option kết nối
	- Dùng appId vào option kết nối

**Khởi tạo thư viện**

Trước khi sử dụng PayME SDK cần gọi phương thức khởi tạo để khởi tạo SDK.
```javascript
<script type="text/javascript">
  let configs = {
    appToken,
    connectToken,
    clientId,
    configColor,
    publicKey,
    privateKey,
    xApi
  }   
</script>
```
Thêm khởi tạo này trước các function deposit/withdraw/pay
```javascript
const view = new PaymeWebSdk(configs, {
  id
});
```

#### Parameters
Tham số gồm 2 Object truyền vào:

 - **Object 1**: Gồm các params sau

| Property    | Type          |Required   | Description  |
|-------------|---------------|:---------:|--------------|
| `appToken`  | `string`      | Yes       | AppId cấp riêng định danh cho mỗi web, cần truyền cho SDK để mã hóa. |  
| `connectToken`  | `string`  |Yes        |Web cần truyền giá trị được cung cấp ở trên, xem cách tạo bên dưới. |  
| `clientId`  | `string`  |Yes        |Là deviceId của thiết bị (chỉ áp dụng cho bản web)|  
| `env`  | `string`  |Yes        |Môi trường chạy SDK. Gồm một trong các môi trường sau: 'production', 'sandbox' |  
| `partner`  | `object`  | No        | <pre lang="json">{<br>  type: string // Web, android, iOS<br>  paddingTop: number // Tùy biến vị trí góc trên cùng khi thiết bị trên app có tùy biến header-statusbar <br>}</pre> |
| `configColor`  | `array` | No       |Là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào. |
| `publicKey`  | `string`  |Yes        |Key này được hệ thống cung cấp sau khi đăng ký merchant SDK |
| `privateKey`  | `string`  |Yes        |Key tự generate khi đăng ký merchant SDK, khi đăng ký, merchant tạo ra 1 cặp key và gửi publicKey cho hệ thống và giữ lại privateKey này |
| `xApi`  | `string`  |Yes        |Là appID khi đăng ký merchant sdk sẽ đc hệ thống tạo cho |

 - **Object 2**: Gồm các params sau

| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id`  | `string`  | Yes |Id của phần tử HTML. Ví dụ: `<div  id="paymeId"></div>` |  
| `width` | `string` | No| Chiều rộng của iframe | 
| `height` | `string` | No | Chiều cao của iframe| 

configColor : là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào.

![enter image description here](https://raw.githubusercontent.com/PayME-Tech/PayME-SDK-Android-Example/main/fe478f50-e3de-4c58-bd6d-9f77d46ce230.png)

Cách tạo **connectToken**:

connectToken cần để truyền gọi api từ tới PayME và sẽ được tạo từ hệ thống backend của app tích hợp. Cấu trúc như sau:

    connectToken = AES256("{ timestamp: 34343242342, userId : "ABC", phone : "0909998877" }" + secretKey )

#### Các chức năng của PayME SDK
**openWallet()- Mở iframe chức năng PayME tổng hợp**
```javascript
<script type="text/javascript">
  let configs = {
    // ... Khai báo ở bước Khởi tạo thư viện
  }
  function openWallet(id) {
    const view = new PaymeWebSdk(configs, {
      id
    })
    view.openWallet()
  }
</script>
```
Mô tả params:
| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id` | `string` | Yes| Id của phần tử HTML. Ví dụ: `<div id="paymeId"></div>` |

**deposit()- Nạp tiền vào ví PayME**

Cần truyền object  `actions` với các params sau:
```javascript
<script type="text/javascript">
  let configs = {
    // ... Khai báo ở bước Khởi tạo thư viện
  }
  function deposit(id) {
    const view = new PaymeWebSdk(configs, {
      id
    })
    view.deposit({
      ...configs,
      actions: {
        type,
        amount,
        description
      }
    })
  }
</script>
```

Mô tả params:
| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id` | `string` | Yes| Id của phần tử HTML. Ví dụ: `<div id="paymeId"></div>` |
| `type`  | `string`  | Yes |Loại thanh toán (deposit) |  
| `amount`  | `number`  | Yes |Số tiền cần nạp |  
| `description` | `string` | Yes| Nội dung nạp tiền |

**withdraw()- Rút tiền từ ví PayME**

Cần truyền object  `actions` với các params sau:
```javascript
<script type="text/javascript">
  let configs = {
    // ... Khai báo ở bước Khởi tạo thư viện
  }
  function withdraw(id) {
    const view = new PaymeWebSdk(configs, {
      id
    })
    view.withdraw({
      ...configs,
      actions: {
        type,
        amount,
        description
      }
    })
  }
</script>
```

Mô tả params:
| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id` | `string` | Yes| Id của phần tử HTML. Ví dụ: `<div id="paymeId"></div>` |
| `type`  | `string`  | Yes |Loại thanh toán (withdraw) |  
| `amount`  | `number`  | Yes |Số tiền cần rút |  
| `description` | `string` | Yes| Nội dung rút tiền |

**onMessage()- Giao tiếp giữa web chủ và ví PayME**

Phương thức được thêm vào mỗi chức năng deposit/withdraw/pay để giao tiếp với web chủ như tắt iframe của ví PayME, thông báo error khi không truyền configs.
```javascript
<script type="text/javascript">
  function withdraw(id) {
    // ... withdraw function
    view.onMessage(id, (e) => {
      // console.log('onMessage',  e.data)
    })
  }
</script>
```

Mô tả params:
| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id` | `string` | Yes| Id của phần tử HTML. Ví dụ: `<div id="paymeId"></div>` |
