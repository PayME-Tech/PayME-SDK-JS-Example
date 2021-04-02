import { useEffect, useRef, useState } from 'react';
import './App.css';
import WebPaymeSDK from 'web-payme-sdk';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Images } from './image';
import { LoadingWeb } from './component/Loading';

const CONFIGS = {
  production: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6NywiaWF0IjoxNjE0OTExMDE0fQ.PJ0ke0Ky_0BoMPi45Cu803VlR8F3e8kOMoNh9I07AR4",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJQKJge1dTHz6Qkyz95X92QnsgDqerCB
      UzBmt/Qg+5E/oKpw7RBfni3SlCDGotBJH437YvsDBMx8OMCP8ROd7McCAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOQIBAAJAZCKupmrF4laDA7mzlQoxSYlQApMzY7EtyAvSZhJs1NeW5dyoc0XL
      yM+/Uxuh1bAWgcMLh3/0Tl1J7udJGTWdkQIDAQABAkAjzvM9t7kD84PudR3vEjIF
      5gCiqxkZcWa5vuCCd9xLUEkdxyvcaLWZEqAjCmF0V3tygvg8EVgZvdD0apgngmAB
      AiEAvTF57hIp2hkf7WJnueuZNY4zhxn7QNi3CQlGwrjOqRECIQCHfqO53A5rvxCA
      ILzx7yXHzk6wnMcGnkNu4b5GH8usgQIhAKwv4WbZRRnoD/S+wOSnFfN2DlOBQ/jK
      xBsHRE1oYT3hAiBSfLx8OAXnfogzGLsupqLfgy/QwYFA/DSdWn0V/+FlAQIgEUXd
      A8pNN3/HewlpwTGfoNE8zCupzYQrYZ3ld8XPGeQ=
      -----END RSA PRIVATE KEY-----`,
    env: "PRODUCTION",
    secretKey: "bda4d9de88f37efb93342d8764ac9b84",
    appId: "7",
    storeId: 25092940
  },

  sandbox: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTQsImlhdCI6MTYxNDE2NDI3MH0.MmzNL81YTx8XyTu6SczAqZtnCA_ALsn9GHsJGBKJSIk",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMyTFdiYBiaSIBgqFdxSgzk5LYXKocgT
      MCx/g1gz9k2jadJ1PDohCs7N65+dh/0dTbT8CIvXrrlAgQT1zitpMPECAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOQIBAAJAZCKupmrF4laDA7mzlQoxSYlQApMzY7EtyAvSZhJs1NeW5dyoc0XL
      yM+/Uxuh1bAWgcMLh3/0Tl1J7udJGTWdkQIDAQABAkAjzvM9t7kD84PudR3vEjIF
      5gCiqxkZcWa5vuCCd9xLUEkdxyvcaLWZEqAjCmF0V3tygvg8EVgZvdD0apgngmAB
      AiEAvTF57hIp2hkf7WJnueuZNY4zhxn7QNi3CQlGwrjOqRECIQCHfqO53A5rvxCA
      ILzx7yXHzk6wnMcGnkNu4b5GH8usgQIhAKwv4WbZRRnoD/S+wOSnFfN2DlOBQ/jK
      xBsHRE1oYT3hAiBSfLx8OAXnfogzGLsupqLfgy/QwYFA/DSdWn0V/+FlAQIgEUXd
      A8pNN3/HewlpwTGfoNE8zCupzYQrYZ3ld8XPGeQ=
      -----END RSA PRIVATE KEY-----`,
    env: "SANDBOX",
    secretKey: "de7bbe6566b0f1c38898b7751b057a94",
    appId: "14",
    storeId: 24088141
  },
}


function App() {
  const refPaymeSDK = useRef(null)
  const [env, setEnv] = useState("sandbox")
  const [clientId, setClientId] = useState('')

  const [userId, setUserId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [balancce, setBalance] = useState(0)


  const [appID, setAppID] = useState(CONFIGS[env].appId)
  const [appToken, setAppToken] = useState(CONFIGS[env].appToken)
  const [publicKey, setPublicKey] = useState(CONFIGS[env].publicKey)
  const [privateKey, setPrivateKey] = useState(CONFIGS[env].privateKey)
  const [secretKey, setSecretKey] = useState(CONFIGS[env].secretKey)

  const [payMoney, setPayMoney] = useState('')
  const [depositMoney, setDepositMoney] = useState('')
  const [withdrawMoney, setWithdrawMoney] = useState('')

  const [isSettings, setIsSettings] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [showLog, setShowLog] = useState(false)

  const [loading, setLoading] = useState(false)

  const options = [
    'sandbox', 'production'
  ];

  const defaultOption = options[0];


  useEffect(() => {
    (async () => {
      // We recommend to call `load` at application startup.
      const fp = await FingerprintJS.load();

      // The FingerprintJS agent is ready.
      // Get a visitor identifier when you'd like to.
      const result = await fp.get();

      // This is the visitor identifier:
      const visitorId = result.visitorId;
      setClientId(visitorId)
    })();
  }, [])

  const checkUserId = () => {
    if (userId === '') {
      alert("userID is required!")
      return false
    }
    return true
  }

  const checkMoney = (money) => {
    const m = Number(money)
    if (m < 10000) {
      alert("Vui lòng nhập số tiền lớn hơn 10,000 đ.")
      return false
    } else if (m >= 100000000) {
      alert("Vui lòng nhập số tiền nhỏ hơn 100,000,000 đ.")
      return false
    }
    return true
  }

  const login = async () => {
    if (!checkUserId()) {
      return
    }
    setLoading(true)
    const res = await fetch(`http://alcohol-delivery.toptravelasia.com/createConnectToken/${userId}/${secretKey}/${phoneNumber}`)
    if (res.status === 200) {
      const { connectToken } = await res.json()
      console.log("connectToken", connectToken)
      const configs = {
        connectToken,
        appToken,
        clientId,
        env,
        partner: {
          type: "web",
          paddingTop: 20,
        },
        showLog: showLog ? "1" : "0",
        configColor: ["#00ffff", "#ff0000"],
        publicKey: publicKey,
        privateKey: privateKey,
        xApi: appID,
      }

      refPaymeSDK.current?.login(configs, data => {
        console.log("==========================object", data)
        if (!data?.error) {
          alert("Login thành công.")
          setIsLogin(true)
          setTimeout(() => getBalance(), 100)
          setLoading(false)
        } else {
          const message = data?.error?.[0]?.message
          alert(message ?? "Login thất bại.")
          setIsLogin(false)
          setLoading(false)
        }
      })
    } else {
      alert("Tạo connectToken thất bại.")
    }
  }

  const logout = () => {
    setUserId("")
    setPhoneNumber("")
    setIsLogin(false)
  }


  const handleChangeEnv = (env) => {
    setAppID(CONFIGS[env].appId)
    setAppToken(CONFIGS[env].appToken)
    setPublicKey(CONFIGS[env].publicKey)
    setPrivateKey(CONFIGS[env].privateKey)
    setSecretKey(CONFIGS[env].secretKey)
    setIsLogin(false)
  }

  const handleRestoreDefault = () => {
    setAppID(CONFIGS[env].appId)
    setAppToken(CONFIGS[env].appToken)
    setPublicKey(CONFIGS[env].publicKey)
    setPrivateKey(CONFIGS[env].privateKey)
    setSecretKey(CONFIGS[env].secretKey)
    setShowLog(false)
    setIsLogin(false)
  }

  const handleSave = () => {
    setIsSettings(false)
    setIsLogin(false)
  }

  const openWallet = () => {
    refPaymeSDK.current?.openWallet()
  }

  const getBalance = () => {
    setLoading(true)
    refPaymeSDK.current?.getBalance(response => {
      console.log("==========================object", response)
      setBalance(response?.balance ?? 0)
      setLoading(false)
    })
  }

  const deposit = (param) => {
    if (!checkMoney(depositMoney)) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(depositMoney) : 10000
    }
    refPaymeSDK.current?.deposit(data)
  }

  const withdraw = (param) => {
    if (!checkMoney(withdrawMoney)) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(withdrawMoney) : 10000
    }
    refPaymeSDK.current?.withdraw(data)
  }

  const pay = () => {
    if (!checkMoney(payMoney)) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(payMoney) : 10000,
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      note: "note",
    }

    refPaymeSDK.current?.pay(data)
  }

  const getListService = () => {
    setLoading(true)
    refPaymeSDK.current?.getListService(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
      setLoading(false)
    })
  }

  const getAccountInfo = () => {
    setLoading(true)
    refPaymeSDK.current?.getAccountInfo(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
      setLoading(false)
    })
  }

  // const openService = () => {
  //   refPaymeSDK.current?.openService(data => {
  //     console.log("==========================object", data)
  //     alert(JSON.stringify(data))
  //   })
  // }

  const getListPaymentMethod = () => {
    setLoading(true)
    refPaymeSDK.current?.getListPaymentMethod(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
      setLoading(false)
    })
  }

  const onSelect = (selected) => {
    setEnv(selected.value)
    handleChangeEnv(selected.value)
  }

  const handleChangeUserId = (event) => {
    const userIdValid = event.target.validity.valid
      ? event.target.value
      : userId
    setUserId(userIdValid)
  }

  const handleChangePhoneNumber = (event) => {
    const phoneNumberValid = event.target.validity.valid
      ? event.target.value
      : payMoney
    setPhoneNumber(phoneNumberValid)
  }

  const handleChangeDepositMoney = (event) => {
    const depositMoneyValid = event.target.validity.valid
      ? event.target.value
      : depositMoney
    setDepositMoney(depositMoneyValid)
  }

  const handleChangeWithdrawMoney = (event) => {
    const withdrawMoneyValid = event.target.validity.valid
      ? event.target.value
      : withdrawMoney
    setWithdrawMoney(withdrawMoneyValid)
  }

  const handleChangePayMoney = (event) => {
    const payMoneyValid = event.target.validity.valid
      ? event.target.value
      : payMoney
    setPayMoney(payMoneyValid)
  }

  const handleChangeAppID = (event) => {
    setAppID(event.target.value)
  }

  const handleChangeAppToken = (event) => {
    setAppToken(event.target.value)
  }

  const handleChangeSecretKey = (event) => {
    setSecretKey(event.target.value)
  }

  const handleChangePublicKey = (event) => {
    setPublicKey(event.target.value)
  }

  const handleChangePrivateKey = (event) => {
    setPrivateKey(event.target.value)
  }

  const handleChangeShowLog = (event) => {
    setShowLog(event.target.checked)
  }

  return (
    <>
      <div className="App">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 16px', alignItems: 'center' }}>
          <p>Enviroment</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Dropdown
              options={options}
              onChange={onSelect}
              value={defaultOption}
              placeholder="Select an option"
            />
            <div onClick={() => setIsSettings(!isSettings)} onKeyPress={() => setIsSettings(!isSettings)}>
              <img style={{ marginLeft: 12 }} src={Images.settings} alt="" />
            </div>
          </div>
        </div>

        {isSettings ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>App ID</p>
              <input style={{ padding: 8 }} type='text' value={appID} onChange={handleChangeAppID} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>App Token</p>
              <textarea placeholder="Optional" value={appToken} onChange={handleChangeAppToken} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>PayME Public Key (RSA)</p>
              <textarea placeholder="Optional" value={publicKey} onChange={handleChangePublicKey} rows={5} cols={5} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>App Private Key (RSA)</p>
              <textarea placeholder="Optional" value={privateKey} onChange={handleChangePrivateKey} rows={10} cols={10} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>Secret key (AES)</p>
              <input style={{ padding: 8 }} placeholder="Optional" type='text' value={secretKey} onChange={handleChangeSecretKey} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', padding: '0px 16px', alignItems: 'center' }}>
              <input placeholder="Optional" type='checkbox' checked={showLog} onChange={handleChangeShowLog} />
              <p>Show log</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '16px' }}>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => handleRestoreDefault()}>Reset Defeault</button>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => handleSave()}>Save</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>UserId</p>
              <input style={{ padding: 8 }} inputMode='numeric' pattern="[0-9]*" placeholder="Required" type='text' value={userId} onChange={handleChangeUserId} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>Phone number</p>
              <input style={{ padding: 8 }} inputMode='numeric' pattern="[0-9]*" placeholder="Optional" type='number' value={phoneNumber} onChange={handleChangePhoneNumber} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '16px' }}>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => login()}>Login</button>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => logout()}>Logout</button>
            </div>

            {isLogin && (
              <div style={{ display: 'flex', backgroundColor: 'gray', borderRadius: 5, flexDirection: 'column', margin: '0px 16px', padding: '16px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <p>Balance</p>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p>{`${balancce} đ`}</p>
                    <div onClick={() => getBalance()} onKeyPress={() => getBalance()}>
                      <img style={{ marginLeft: 12 }} src={Images.reload} alt="" />
                    </div>
                  </div>
                </div>
                <button style={{ marginBottom: 12, borderRadius: 10, border: 'none', padding: 8 }} type="button" onClick={() => openWallet()}>Open Wallet</button>

                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, border: 'none', padding: 8, flex: 1, marginRight: 16 }} type="button" onClick={() => deposit()}>Nạp tiền ví</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={depositMoney} onChange={handleChangeDepositMoney} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, border: 'none', padding: 8, flex: 1, marginRight: 16 }} type="button" onClick={() => withdraw()}>Rút tiền ví</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={withdrawMoney} onChange={handleChangeWithdrawMoney} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, border: 'none', padding: 8, flex: 1, marginRight: 16 }} type="button" onClick={() => pay()}>Thanh toán</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={payMoney} onChange={handleChangePayMoney} />
                </div>

                <button style={{ marginBottom: 12, borderRadius: 10, border: 'none', padding: 8 }} type="button" onClick={() => getListPaymentMethod()}>Get List Payment Method</button>

                <button style={{ marginBottom: 12, borderRadius: 10, border: 'none', padding: 8 }} type="button" onClick={() => getAccountInfo()}>Get Account Info</button>

                <button style={{ marginBottom: 12, borderRadius: 10, border: 'none', padding: 8 }} type="button" onClick={() => getListService()}>Get List Service</button>
              </div>
            )}
          </>
        )}
        <WebPaymeSDK ref={refPaymeSDK} />
      </div>
      <LoadingWeb loading={loading} />
    </>
  );
}

export default App;
