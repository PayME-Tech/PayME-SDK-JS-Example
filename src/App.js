import { useEffect, useRef, useState } from 'react';
import './App.css';
import WebPaymeSDK from 'web-payme-sdk';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Images } from './image';
import { LoadingWeb } from './component/Loading';

const ERROR_CODE = {
  EXPIRED: 401,
  NETWORK: -1,
  SYSTEM: -2,
  LITMIT: -3,
  NOT_ACTIVED: -4,
  NOT_KYC: -5,
  PAYMENT_ERROR: -6,
  ERROR_KEY_ENCODE: -7,
  USER_CANCELLED: -8,
  NOT_LOGIN: -9,
  CLOSE_IFRAME: -10
}

const CONFIGS = {
  // production: {
  //   appToken:
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6NywiaWF0IjoxNjE0OTExMDE0fQ.PJ0ke0Ky_0BoMPi45Cu803VlR8F3e8kOMoNh9I07AR4",
  //   publicKey: `-----BEGIN PUBLIC KEY-----
  //     MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJQKJge1dTHz6Qkyz95X92QnsgDqerCB
  //     UzBmt/Qg+5E/oKpw7RBfni3SlCDGotBJH437YvsDBMx8OMCP8ROd7McCAwEAAQ==
  //     -----END PUBLIC KEY-----`,
  //   privateKey: `-----BEGIN RSA PRIVATE KEY-----
  //     MIIBOQIBAAJAZCKupmrF4laDA7mzlQoxSYlQApMzY7EtyAvSZhJs1NeW5dyoc0XL
  //     yM+/Uxuh1bAWgcMLh3/0Tl1J7udJGTWdkQIDAQABAkAjzvM9t7kD84PudR3vEjIF
  //     5gCiqxkZcWa5vuCCd9xLUEkdxyvcaLWZEqAjCmF0V3tygvg8EVgZvdD0apgngmAB
  //     AiEAvTF57hIp2hkf7WJnueuZNY4zhxn7QNi3CQlGwrjOqRECIQCHfqO53A5rvxCA
  //     ILzx7yXHzk6wnMcGnkNu4b5GH8usgQIhAKwv4WbZRRnoD/S+wOSnFfN2DlOBQ/jK
  //     xBsHRE1oYT3hAiBSfLx8OAXnfogzGLsupqLfgy/QwYFA/DSdWn0V/+FlAQIgEUXd
  //     A8pNN3/HewlpwTGfoNE8zCupzYQrYZ3ld8XPGeQ=
  //     -----END RSA PRIVATE KEY-----`,
  //   env: "PRODUCTION",
  //   secretKey: "bda4d9de88f37efb93342d8764ac9b84",
  //   appId: "7",
  //   storeId: 25092940
  // },
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
  dev: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Njg2OH0.JyIdhQEX_Lx9CXRH4iHM8DqamLrMQJk5rhbslNW4GzY",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKi
      wIhTJpAi1XnbfOSrW/Ebw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOwIBAAJBAOkNeYrZOhKTS6OcPEmbdRGDRgMHIpSpepulZJGwfg1IuRM+ZFBm
      F6NgzicQDNXLtaO5DNjVw1o29BFoK0I6+sMCAwEAAQJAVCsGq2vaulyyI6vIZjkb
      5bBId8164r/2xQHNuYRJchgSJahHGk46ukgBdUKX9IEM6dAQcEUgQH+45ARSSDor
      mQIhAPt81zvT4oK1txaWEg7LRymY2YzB6PihjLPsQUo1DLf3AiEA7Tv005jvNbNC
      pRyXcfFIy70IHzVgUiwPORXQDqJhWJUCIQDeDiZR6k4n0eGe7NV3AKCOJyt4cMOP
      vb1qJOKlbmATkwIhALKSJfi8rpraY3kLa4fuGmCZ2qo7MFTKK29J1wGdAu99AiAQ
      dx6DtFyY8hoo0nuEC/BXQYPUjqpqgNOx33R4ANzm9w==
      -----END RSA PRIVATE KEY-----`,
    env: "DEV",
    secretKey: "zfQpwE6iHbOeAfgX",
    appId: "6868",
    storeId: 6868
  },
}


function App() {
  const refPaymeSDK = useRef(null)
  const appRef = useRef(null)
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

  const [payMoney, setPayMoney] = useState('10000')
  const [depositMoney, setDepositMoney] = useState('10000')
  const [withdrawMoney, setWithdrawMoney] = useState('10000')

  const [isSettings, setIsSettings] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [showLog, setShowLog] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const options = [
    'dev', 'sandbox'
  ];

  const defaultOption = options[1];

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
    if (phoneNumber === '') {
      alert("Phone Number is required!")
      return false
    }
    return true
  }

  const checkMoney = (money, type) => {
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
    const res = await fetch(`https://alcohol-delivery.toptravelasia.com/createConnectToken/${userId}/${secretKey}/${phoneNumber}`)
    if (res.status === 200) {
      const { connectToken } = await res.json()
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
        // configColor: ["#00ffff", "#ff0000"],
        publicKey: publicKey,
        privateKey: privateKey,
        appId: appID,
        phone: phoneNumber ?? ''
      }

      refPaymeSDK.current?.login(configs,
        (respone) => {
          console.log('respone login', respone);
          // alert('Login thành công')
          setIsLogin(true);
          setLoading(false);
          getBalance();
        },
        (error) => {
          console.log('error login', error);
          if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.NOT_ACTIVED) {
            setIsLogin(true)
          } else {
            showErrorMessage(error)
            setIsLogin(false);
          }
          setLoading(false);
        }

      )
    } else {
      alert("Tạo connectToken thất bại.")
      setLoading(false)
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

  const showErrorMessage = (res) => {
    let message = 'Có lỗi xảy ra';
    if (res?.message) {
      if (res?.message?.message) {
        message = res?.message?.message
      } else {
        message = res?.message
      }
    }
    alert(message);
  }

  const openWallet = () => {
    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.openWallet(
        (response) => {
          setLoading(false)
          console.log('onSucces openWallet', response)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else {
            if (error?.code === ERROR_CODE.EXPIRED) {
              logout()
            }
            showErrorMessage(error)
          }
          setLoading(false)
          console.log('onError openWallet', error)
        }
      )
    }, 100)
  }

  const getBalance = () => {
    refPaymeSDK.current?.getBalance(
      (response) => {
        setLoading(false)
        setBalance(response?.data?.balance ?? 0)
      },
      (error) => {
        if (error?.code === ERROR_CODE.EXPIRED) {
          showErrorMessage(error)
          logout()
        }
        setLoading(false)
        console.log('error getWalletInfo', error);
        setBalance(0);
      }
    )
  }

  const deposit = (param) => {
    if (!checkMoney(depositMoney, 'DEPOSIT')) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(depositMoney) : 10000
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.deposit(data,
        (response) => {
          console.log('onSucces', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else {
            if (error?.code === ERROR_CODE.EXPIRED) {
              logout()
            }
            if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.ACCOUNT_NOT_KYC || error?.code === ERROR_CODE.ACCOUNT_NOT_ACTIVITIES) {
              showErrorMessage(error)
            }
          }
          console.log('onError deposit', error)
          setLoading(false)
        }
      )
    }, 100)
  }

  const withdraw = (param) => {
    if (!checkMoney(withdrawMoney, 'WITHDRAW')) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(withdrawMoney) : 10000
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.withdraw(data,
        (response) => {
          console.log('onSucces', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else {
            if (error?.code === ERROR_CODE.EXPIRED) {
              logout()
            }
            if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.ACCOUNT_NOT_KYC || error?.code === ERROR_CODE.ACCOUNT_NOT_ACTIVITIES) {
              showErrorMessage(error)
            }
          }
          console.log('onError withdraw', error)
          setLoading(false)
        }
      )
    }, 100)
  }

  const pay = () => {
    if (!checkMoney(payMoney, 'PAY')) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(payMoney) : 10000,
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      note: "note"
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.pay(data,
        (response) => {
          console.log('onSucces', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else {
            if (error?.code === ERROR_CODE.EXPIRED) {
              logout()
            }
            if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.ACCOUNT_NOT_KYC || error?.code === ERROR_CODE.ACCOUNT_NOT_ACTIVITIES) {
              showErrorMessage(error)
            }
          }
          setLoading(false)
          console.log('error pay', error);
        }
      )
    }, 100)
  }

  const getListService = () => {
    setLoading(true)
    refPaymeSDK.current?.getListService(
      (response) => {
        alert(JSON.stringify(response.data))
        setLoading(false);
      },
      (error) => {
        if (error?.code === ERROR_CODE.EXPIRED) {
          logout()
        }
        setLoading(false);
        console.log('error getListService', error);
        showErrorMessage(error)
      }
    )
  }

  const getAccountInfo = () => {
    setLoading(true)
    refPaymeSDK.current?.getAccountInfo(
      (response) => {
        alert(JSON.stringify(response))
        setLoading(false)
      },
      (error) => {
        if (error?.code === ERROR_CODE.EXPIRED) {
          logout()
        }
        setLoading(false)
        console.log('error getAccountInfo', error);
        showErrorMessage(error)
      }
    )
  }

  // const openService = () => {
  //   refPaymeSDK.current?.openService(data => {
  //     alert(JSON.stringify(data))
  //   })
  // }

  const getListPaymentMethod = () => {
    setLoading(true)
    refPaymeSDK.current?.getListPaymentMethod(
      (response) => {
        alert(JSON.stringify(response))
        setLoading(false)
      },
      (error) => {
        if (error?.code === ERROR_CODE.EXPIRED) {
          logout()
        }
        setLoading(false)
        console.log('error getListPaymentMethod', error);
        showErrorMessage(error)
      }
    )
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
      <div ref={appRef} style={{ position: 'relative', overflowY: isOpen ? 'hidden' : 'unset' }} className="App">
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 16px', alignItems: 'center' }}>
          <p>Enviroment</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Dropdown
              options={options}
              onChange={onSelect}
              value={defaultOption}
              placeholder="Select an option"
            />
            <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsSettings(!isSettings)} onKeyPress={() => setIsSettings(!isSettings)}>
              <img style={{ marginLeft: 12 }} src={isSettings ? Images.leftArrow : Images.settings} alt="" />
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
              <textarea placeholder="Required" value={appToken} onChange={handleChangeAppToken} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>PayME Public Key (RSA)</p>
              <textarea placeholder="Required" value={publicKey} onChange={handleChangePublicKey} rows={5} cols={5} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>App Private Key (RSA)</p>
              <textarea placeholder="Required" value={privateKey} onChange={handleChangePrivateKey} rows={10} cols={10} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>Secret key (AES)</p>
              <input style={{ padding: 8 }} placeholder="Required" type='text' value={secretKey} onChange={handleChangeSecretKey} />
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
              <input style={{ padding: 8 }} inputMode='numeric' pattern="[0-9]*" placeholder="Required" type='number' value={phoneNumber} onChange={handleChangePhoneNumber} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '16px' }}>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => login()}>Login</button>
              <button style={{ width: '40%', padding: 8 }} type="button" onClick={() => logout()}>Logout</button>
            </div>

            {isLogin && (
              <div style={{ display: 'flex', backgroundColor: 'gray', borderRadius: 5, flexDirection: 'column', margin: '0px 16px', padding: '0px   16px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <p>Balance</p>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p>{`${balancce} đ`}</p>
                    <div onClick={() => getBalance()} onKeyPress={() => getBalance()}>
                      <img style={{ marginLeft: 12 }} src={Images.reload} alt="" />
                    </div>
                  </div>
                </div>
                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => openWallet()}>Open Wallet</button>

                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, padding: 8, flex: 1, marginRight: 16, backgroundColor: '#e8f2e8' }} type="button" onClick={() => deposit()}>Nạp tiền ví</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={depositMoney} onChange={handleChangeDepositMoney} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, padding: 8, flex: 1, marginRight: 16, backgroundColor: '#e8f2e8' }} type="button" onClick={() => withdraw()}>Rút tiền ví</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={withdrawMoney} onChange={handleChangeWithdrawMoney} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, padding: 8, flex: 1, marginRight: 16, backgroundColor: '#e8f2e8' }} type="button" onClick={() => pay()}>Thanh toán</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={payMoney} onChange={handleChangePayMoney} />
                </div>

                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => getListPaymentMethod()}>Get List Payment Method</button>

                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => getAccountInfo()}>Get Account Info</button>

                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => getListService()}>Get List Service</button>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Version: 2021-04-23</p>
            </div>
          </>
        )}
        <WebPaymeSDK ref={refPaymeSDK} />
      </div>
      <LoadingWeb loading={loading} />
    </>
  );
}

export default App;
