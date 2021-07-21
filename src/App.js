import { useEffect, useRef, useState } from 'react';
import './App.css';
import WebPaymeSDK, { LANGUAGES, PAY_CODE } from 'web-payme-sdk';
// import WebPaymeSDK, { LANGUAGES, PAY_CODE } from './PaymeSDK';
import Select from 'react-select';

import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Images } from './image';
import { LoadingWeb } from './component/Loading';
import { encrypt } from './helper/genConnectToken';
import { useMediaQuery } from 'react-responsive';

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

let CONFIGS = {
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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTIsImlhdCI6MTYyMDg4MjQ2NH0.DJfi52Dc66IETflV2dQ8G_q4oUAVw_eG4TzrqkL0jLU",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJi70XBS5+LtaCrNsrnWlVG6xec+J9M1
      DzzvsmDfqRgTIw7RQ94SnEBBcTXhaIAZ8IW7OIWkVU0OXcybQEoLsdUCAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOgIBAAJBAIA7GmDWkjuOQsx99tACXhOlJ4atsBN0YMPEmKhi9Ewk6bNBPvaX
      pRMWjn7c8GfWrFUIVqlrvSlMYxmW/XaATjcCAwEAAQJAKZ6FPj8GcWwIBEUyEWtj
      S28EODMxfe785S1u+uA7OGcerljPNOTme6iTuhooO5pB9Q5N7nB2KzoWOADwPOS+
      uQIhAN2S5dxxadDL0wllNGeux7ltES0z2UfW9+RViByX/fAbAiEAlCd86Hy6otfd
      k9K2YeylsdDwZfmkKq7p27ZcNqVUlBUCIQCxzEfRHdzoZDZjKqfjrzerTp7i4+Eu
      KYzf19aSA1ENEwIgAnyXMB/H0ivlYDHNNd+O+GkVX+DMzJqa+kEZUyF7RfECICtK
      rkcDyRzI6EtUFG+ALQOUliRRh7aiGXXZYb2KnlKy
      -----END RSA PRIVATE KEY-----`,
    env: "DEV",
    secretKey: "34cfcd29432cdd5feaecb87519046e2d",
    appId: "12",
    storeId: 9
  },
}


function App() {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  const refPaymeSDK = useRef(null)
  const appRef = useRef(null)
  const [deviceId, setDeviceId] = useState('')
  const [lang, setLang] = useState('vi')

  const [userId, setUserId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [balancce, setBalance] = useState(0)

  const [env, setEnv] = useState('sandbox')
  const [appID, setAppID] = useState(CONFIGS[env].appId)
  const [appToken, setAppToken] = useState(CONFIGS[env].appToken)
  const [publicKey, setPublicKey] = useState(CONFIGS[env].publicKey)
  const [privateKey, setPrivateKey] = useState(CONFIGS[env].privateKey)
  const [secretKey, setSecretKey] = useState(CONFIGS[env].secretKey)

  const [payQRCode, setPayQRCode] = useState('OPENEWALLET|24088141|PAYMENT|20000|Chuyentien|2445562323')
  const [payMoney, setPayMoney] = useState('10000')

  const [depositMoney, setDepositMoney] = useState('10000')
  const [withdrawMoney, setWithdrawMoney] = useState('10000')
  const [transferMoney, setTransferMoney] = useState('10000')

  const [isSettings, setIsSettings] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [showLog, setShowLog] = useState(false)

  const [isOpen, setIsOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [configs, setConfigs] = useState({
    appToken,
    deviceId,
    env,
    partner: {
      type: "web"
    },
    showLog: showLog ? "1" : "0",
    configColor: ["#4430b3", "#6756d6"],
    publicKey: publicKey,
    privateKey: privateKey,
    appId: appID,
  })

  const options = [
    { value: 'dev', label: 'dev' },
    { value: 'sandbox', label: 'sandbox' }
  ]

  const optionsLang = [
    { value: LANGUAGES.VI, label: 'Tiếng Việt' },
    { value: LANGUAGES.EN, label: 'Tiếng Anh' }
  ]

  const listMethod = Object.keys(PAY_CODE).map(key => ({ label: key, value: PAY_CODE[key] }));

  const [listService, setListService] = useState([])
  const [serviceCode, setServiceCode] = useState('')
  const [payCode, setPayCode] = useState()
  
  const defaultOption = options[1];
  const defaultOptionLang = optionsLang[0];

  useEffect(() => {
    if (window.location.hostname === 'sbx-sdk-demo.payme.net.vn') {
      setEnv('sandbox')
      handleChangeEnv('sandbox')
    } else if (window.location.hostname === 'staging-sdk-demo.payme.net.vn') {
      setEnv('staging')
      handleChangeEnv('staging')
    }
    /* iOS re-orientation fix */
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
      /* iOS hides Safari address bar */
      window.addEventListener("load", function () {
        setTimeout(function () {
          window.scrollTo(0, 1);
        }, 1000);
      });
    }
    (async () => {
      // We recommend to call `load` at application startup.
      const fp = await FingerprintJS.load();

      // The FingerprintJS agent is ready.
      // Get a visitor identifier when you'd like to.
      const result = await fp.get();

      // This is the visitor identifier:
      const visitorId = result.visitorId;
      setDeviceId(visitorId)
    })();
  }, [])

  useEffect(() => {
    setConfigs({
      appToken,
      deviceId,
      env,
      lang: lang,
      partner: {
        type: "web"
      },
      showLog: showLog ? "1" : "0",
      configColor: ["#4430b3", "#6756d6"],
      publicKey: publicKey,
      privateKey: privateKey,
      appId: appID,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, appID, appToken, publicKey, privateKey, env, showLog, lang])

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

  const resetState = () => {
    setListService([])
    setPayCode('')
    setServiceCode('')
    setIsLogin(false)
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
    resetState()
    try {
      const connectToken = encrypt(JSON.stringify({ userId, timestamp: Date.now(), phone: phoneNumber }), secretKey)
      const configsLogin = {
        ...configs,
        connectToken,
        phone: phoneNumber ?? ''
      }

      refPaymeSDK.current?.login(configsLogin,
        (respone) => {
          console.log('respone login', respone);
          // alert('Login thành công')
          setIsLogin(true);
          getBalance();
          // getListPaymentMethod()
          // setLoading(false);
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
    } catch (error) {
      console.log('error', error)
      setLoading(false)
      alert('Tạo connectToken thất bại')
    }
  }

  const logout = () => {
    setUserId("")
    setPhoneNumber("")
    setIsLogin(false)
    setConfigs({
      appToken,
      deviceId,
      env,
      partner: {
        type: "web"
      },
      showLog: showLog ? "1" : "0",
      configColor: ["#4430b3", "#6756d6"],
      publicKey: publicKey,
      privateKey: privateKey,
      appId: appID,
    })
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

  const scanQR = () => {
    const data = {
      payCode
    }
    refPaymeSDK.current?.scanQR(
      data,
      (response) => {
        console.log('onSucces scanQR', response)
        setLoading(false)
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
        console.log('onError scanQR', error)
      }
    )
  }

  const getBalance = () => {
    refPaymeSDK.current?.getBalance(
      (response) => {
        setLoading(false)
        setBalance(response?.balance ?? 0)
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
      amount: env === 'sandbox' ? Number(depositMoney) : 10000,
      closeWhenDone: true
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.deposit(data,
        (response) => {
          console.log('onSucces Deposit', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else if (error?.code === ERROR_CODE.EXPIRED) {
            logout()
          }
          else if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.NOT_KYC || error?.code === ERROR_CODE.NOT_ACTIVED) {
            showErrorMessage(error)
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
      amount: env === 'sandbox' ? Number(withdrawMoney) : 10000,
      closeWhenDone: true
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.withdraw(data,
        (response) => {
          console.log('onSucces Withdraw', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else if (error?.code === ERROR_CODE.EXPIRED) {
            logout()
          } else if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.NOT_KYC || error?.code === ERROR_CODE.NOT_ACTIVED) {
            showErrorMessage(error)
          }

          console.log('onError withdraw', error)
          setLoading(false)
        }
      )
    }, 100)
  }

  const transfer = (param) => {
    if (!checkMoney(transferMoney)) {
      return
    }

    const data = {
      amount: env === 'sandbox' ? Number(transferMoney) : 10000,
      description: 'Chuyển tiền',
      closeWhenDone: true
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.transfer(data,
        (response) => {
          console.log('onSucces Transfer', response)
          setLoading(false)
        },
        (error) => {
          if (error?.code === ERROR_CODE.CLOSE_IFRAME) {
            setIsOpen(false)
          } else if (error?.code === ERROR_CODE.EXPIRED) {
            logout()
          } else if (error?.code === ERROR_CODE.NOT_LOGIN || error?.code === ERROR_CODE.NOT_KYC || error?.code === ERROR_CODE.NOT_ACTIVED) {
            showErrorMessage(error)
          }

          console.log('onError Transfer', error)
          setLoading(false)
        }
      )
    }, 100)
  }

  const onPayQRCode = () => {
    const data = {
      qrContent: payQRCode,
      payCode
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.payQRCode(data,
        (response) => {
          console.log('onSucces Pay', response)
          setLoading(false)
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
          console.log('error pay', error);
        }
      )
    }, 100)
  }

  const payWithMethod = () => {
    if (!checkMoney(payMoney)) {
      return
    }
    const data = {
      amount: env === 'sandbox' ? Number(payMoney) : 10000,
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      note: "note",
      payCode
    }

    appRef.current.scrollTo(0, 0)
    setTimeout(() => {
      setIsOpen(true)
      refPaymeSDK.current?.pay(data,
        (response) => {
          console.log('onSucces payWithMethod', response)
          setLoading(false)
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
          console.log('error payWithMethod', error);
        }
      )
    }, 100)
  }

  const getListService = () => {
    setLoading(true)
    refPaymeSDK.current?.getListService(
      (response) => {
        setListService(response?.filter((item) => item.enable).map((item) => {
          return {
            value: item.code,
            label: item.description
          }
        }))
        alert(JSON.stringify(response))
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

  const openService = () => {
    if (serviceCode) {
      refPaymeSDK.current?.openService(
        serviceCode,
        (response) => {
          console.log('onSucces openService', response)
          setLoading(false)
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
          console.log('onError openService', error)
        }
      )
    } else {
      alert('Vui lòng chọn dịch vụ!')
    }
  }

  const onSelect = (selected) => {
    setEnv(selected.value)
    handleChangeEnv(selected.value)
  }


  const onSelectLang = (selected) => {
    setLang(selected.value)
  }

  const onSelectService = (selected) => {
    setServiceCode(selected.value)
  }

  const onSelectMethod = (selected) => {
    setPayCode(selected.value)
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
      : phoneNumber
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

  const handleChangeTransferMoney = (event) => {
    const depositMoneyValid = event.target.validity.valid
      ? event.target.value
      : depositMoney
    setTransferMoney(depositMoneyValid)
  }

  const handlePayQRCode = (event) => {
    setPayQRCode(event.target.value)
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

  const isMobileStyle = (isDesktop || isTablet) ? {
    height: '80%',
    width: 500,
    top: '50%',
    left: '50%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  } : {}

  return (
    <>
      <div ref={appRef} style={{ position: 'relative', overflowY: isOpen ? 'hidden' : 'unset' }} className="App">
        <div style={{ display: 'flex', flexDirection: 'row', padding: '0px 16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, margin: '16px 0px' }}>
            {window.location.hostname === 'localhost' && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ flex: 1 }}>Enviroment</p>
                <Select
                  options={options}
                  onChange={onSelect}
                  defaultValue={defaultOption}
                  placeholder="Select an option"
                  className='dropbox'
                />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <p style={{ flex: 1 }}>Ngôn ngữ cho SDK</p>
              <Select
                options={optionsLang}
                onChange={onSelectLang}
                defaultValue={defaultOptionLang}
                placeholder="Select an option"
                className='dropbox'
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => setIsSettings(!isSettings)} onKeyPress={() => setIsSettings(!isSettings)}>
            <img style={{ marginLeft: 12 }} src={isSettings ? Images.leftArrow : Images.settings} alt="" />
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
              <input style={{ padding: 8, border: '0.5px solid #cbcbcb' }} inputMode='numeric' pattern="[0-9]*" placeholder="Required" type='text' value={userId} onChange={handleChangeUserId} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 16px' }}>
              <p>Phone number</p>
              <input style={{ padding: 8, border: '0.5px solid #cbcbcb' }} inputMode='numeric' pattern="[0-9]*" placeholder="Required" type='number' value={phoneNumber} onChange={handleChangePhoneNumber} />
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

                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <button style={{ borderRadius: 10, padding: 8, flex: 1, marginRight: 16, backgroundColor: '#e8f2e8' }} type="button" onClick={() => transfer()}>Chuyển tiền ví</button>
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ padding: 6, border: 'none', outline: 'none' }} type='text' value={depositMoney} onChange={handleChangeTransferMoney} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <button style={{ flex: 1, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8', marginRight: 16 }} type="button" onClick={() => payWithMethod()}>Pay</button>
                  <Select
                    options={listMethod}
                    onChange={onSelectMethod}
                    // defaultValue={defaultOptionPayCode}
                    placeholder="Chọn phương thức"
                    className='dropdownPay'

                  />
                  <input maxLength={9} inputMode='numeric' pattern="[0-9]*" style={{ flex: 1, marginLeft: 16, padding: 6, border: 'none', outline: 'none' }} type='text' value={payMoney} onChange={handleChangePayMoney} />
                </div>

                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginBottom: 8 }}>
                  <input maxLength={9} style={{ padding: 6, border: 'none', outline: 'none', marginBottom: 8 }} type='text' value={payQRCode} onChange={handlePayQRCode} />
                  <button style={{ borderRadius: 10, padding: 8, flex: 1, backgroundColor: '#e8f2e8' }} type="button" onClick={() => onPayQRCode()}>Pay QR Code</button>
                </div>

                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => scanQR()}>Scan QRCode</button>

                <button style={{ marginBottom: 12, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => getAccountInfo()}>Get Account Info</button>

                <button style={{ borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8' }} type="button" onClick={() => getListService()}>Get List Service</button>
                {listService.length === 0 && (<p style={{ fontStyle: 'italic', fontSize: 12, marginBottom: 12 }}>*Để sử dụng hàm Open Service cần lấy list dịch vụ từ hàm trên</p>)}
                {listService.length > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <button style={{ flex: 1, borderRadius: 10, padding: 8, backgroundColor: '#e8f2e8', marginRight: 16 }} type="button" onClick={() => openService()}>Open Service</button>
                    <Select
                      options={listService}
                      onChange={onSelectService}
                      // value={defaultOption}
                      placeholder="Chọn dịch vụ"
                      className='dropbox'
                    />
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Version: <a href="https://www.npmjs.com/package/web-payme-sdk" target="_blank" rel="noreferrer">web-payme-sdk 1.4.4</a></p>
            </div>
          </>
        )}
        <WebPaymeSDK
          ref={refPaymeSDK}
          config={configs}
          propStyle={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            margin: 'auto',
            alignSelf: 'center',
            ...isMobileStyle
          }}
          overlayBackground
        />
      </div>
      <LoadingWeb loading={loading} />
    </>
  );
}

export default App;
