## Usage
Đặt thẻ `<scripts>`  sau đây gần cuối các trang của bạn, ngay trước thẻ đóng `</body>`, để kích hoạt SDK.

**CDN via jsDelivr**
```javascript
<script src="https://cdn.jsdelivr.net/gh/PayME-Tech/WebSDKIntegration@2.0/payme-sdk.min.js"></script>
   ```
**Khởi tạo thư viện**

Trước khi sử dụng PayME SDK cần gọi phương thức khởi tạo để khởi tạo SDK.
```javascript
<script type="text/javascript">
  let configs = {
    appToken,
    connectToken,
    clientId,
    clientInfo: {
      clientId,
      platform,
      appVersion,
      sdkVesion,
      sdkType,
      appPackageName
    }
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
| `clientId`  | `string`  |Yes        |Là device ID |  
| `env`  | `string`  |Yes        |Môi trường chạy SDK |  
| `clientInfo` | `object`     |Yes        |Gồm các item sau <ul><li>platform</li><li>appVersion</li><li>sdkVesion</li><li>sdkType</li><li>appPackageName</li></ul> | 
| `partner`  | `object`  | No        |Gồm các item sau <ul><li>type</li><li>paddingTop</li></ul> |
| `configColor`  | `array` | No       |Là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào. |


 - **Object 2**: Gồm các params sau

| Property    | Type      | Required   | Description  |
|-------------|-----------|:----------:|--------------|
| `id`  | `string`  | Yes |Id của phần tử HTML. Ví dụ: `<div  id="paymeId"></div>` |  
| `width` | `string` | No| Chiều rộng của iframe. Default: 415px | 
| `height` | `string` | No | Chiều cao của iframe. Default: 800px| 

Cách tạo **connectToken**: [https://developers.payme.vn/#khoi-tao-sdk-androi](https://developers.payme.vn/#khoi-tao-sdk-androi)
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
