import { useEffect, useRef, useState } from 'react';
import './App.css';
import { WebPaymeSDK } from './WebPayME';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { encrypt, secretKey } from './helper';

const appSandbox = {
  publicKey: '-----BEGIN PUBLIC KEY-----\n'
    + 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMyTFdiYBiaSIBgqFdxSgzk5LYXKocgT\n'
    + 'MCx/g1gz9k2jadJ1PDohCs7N65+dh/0dTbT8CIvXrrlAgQT1zitpMPECAwEAAQ==\n'
    + '-----END PUBLIC KEY-----',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n'
    + 'MIIBOQIBAAJAZCKupmrF4laDA7mzlQoxSYlQApMzY7EtyAvSZhJs1NeW5dyoc0XL\n'
    + 'yM+/Uxuh1bAWgcMLh3/0Tl1J7udJGTWdkQIDAQABAkAjzvM9t7kD84PudR3vEjIF\n'
    + '5gCiqxkZcWa5vuCCd9xLUEkdxyvcaLWZEqAjCmF0V3tygvg8EVgZvdD0apgngmAB\n'
    + 'AiEAvTF57hIp2hkf7WJnueuZNY4zhxn7QNi3CQlGwrjOqRECIQCHfqO53A5rvxCA\n'
    + 'ILzx7yXHzk6wnMcGnkNu4b5GH8usgQIhAKwv4WbZRRnoD/S+wOSnFfN2DlOBQ/jK\n'
    + 'xBsHRE1oYT3hAiBSfLx8OAXnfogzGLsupqLfgy/QwYFA/DSdWn0V/+FlAQIgEUXd\n'
    + 'A8pNN3/HewlpwTGfoNE8zCupzYQrYZ3ld8XPGeQ=\n'
    + '-----END RSA PRIVATE KEY-----'
}


function App() {
  const refPaymeSDK = useRef(null)
  const [userId, setUserId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [connectToken, setConnectToken] = useState('')
  const [configs, setConfigs] = useState({
    // connectToken: 'iqQQ9STvIfMtzlppuHVJw0naE5vRfxGpxuL/U8p2TxmFWWn9ZU597BR1O9bgAzv+Ra/ineoq5j4l/3xbjitzMqFBPPPauqT+RLEM4N5eJb8=',
    appToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTQsImlhdCI6MTYxNDE2NDI3MH0.MmzNL81YTx8XyTu6SczAqZtnCA_ALsn9GHsJGBKJSIk',

    // connectToken:
    //   "bteBmKpT3Hdwr27ygseRoDZTsb1sLyBTCyz1uO5nOavSncaTAlGwXfnJRlIUf4L94VfKQUgDHUr1vcvZPMXYA3elhC+DomnoJliGhWCC17I=",
    // appToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Njg2OH0.JyIdhQEX_Lx9CXRH4iHM8DqamLrMQJk5rhbslNW4GzY",
    clientId: "0f816b09bdb040e8",
    env: "sandbox",
    partner: {
      type: "web",
      paddingTop: 20,
    },
    actions: {
      type: "GET_WALLET_INFO",
    },
    // showLog: "1",
    configColor: ["#00ffff", "#ff0000"],
    publicKey: appSandbox.publicKey,
    privateKey: appSandbox.privateKey,
    xApi: '14',
    // xApi: "6868",
  })

  const options = [
    'sandbox', 'dev', 'production'
  ];
  const defaultOption = options[0];

  useEffect(() => {
    if (connectToken) {
      setConfigs({
        ...configs,
        connectToken
      })
    }
  }, [connectToken])

  useEffect(() => {
    console.log('configs', configs)
    if (configs.connectToken) {
      refPaymeSDK.current?.login(data => {
        console.log("==========================object", data)
        alert(JSON.stringify(data))
      })
    }
  }, [configs])

  const login = () => {
    if (userId) {
      //'{"timestamp":34343242342,"userId":"CB001","phone":"0944074831"}';
      const data = {
        timestamp: Date.now(),
        userId,
        phone: phoneNumber
      }
      const connectToken = encrypt(JSON.stringify(data), secretKey)

      setConnectToken(connectToken)
    } else {
      alert('Vui lòng nhập UserID')
    }

  }

  const openWallet = () => {
    refPaymeSDK.current?.openWallet()
  }

  const getBalance = () => {
    refPaymeSDK.current?.getBalance(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
    })
  }

  const deposit = (param) => {
    refPaymeSDK.current?.deposit(param)
  }

  const withdraw = (param) => {
    refPaymeSDK.current?.withdraw(param)
  }

  const pay = (param) => {
    refPaymeSDK.current?.pay(param)
  }

  const getListService = () => {
    refPaymeSDK.current?.getListService(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
    })
  }

  const getAccountInfo = () => {
    refPaymeSDK.current?.getAccountInfo(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
    })
  }

  const openService = () => {
    refPaymeSDK.current?.openService(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
    })
  }

  const getListPaymentMethod = () => {
    refPaymeSDK.current?.getListPaymentMethod(data => {
      console.log("==========================object", data)
      alert(JSON.stringify(data))
    })
  }

  const onSelect = () => {

  }

  const handleChangeUserId = (event) => {
    setUserId(event.target.value)
  }

  const handleChangePhoneNumber = (event) => {
    setPhoneNumber(event.target.value)
  }

  return (
    <>
      <div className="App">
        {/* <header className="App-header">

        </header> */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 60px 16px 60px', alignItems: 'center' }}>
          <p>Enviroment</p>
          <Dropdown
            options={options}
            onChange={onSelect}
            value={defaultOption}
            placeholder="Select an option" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 60px 16px 60px' }}>
          <p>UserId</p>
          <input placeholder="Required" type='text' value={userId} onChange={handleChangeUserId} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 60px 16px 60px' }}>
          <p>Phone number</p>
          <input placeholder="Optional" type='number' value={phoneNumber} onChange={handleChangePhoneNumber} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 60px 16px 60px' }}>
          <button type="button" onClick={() => login()}>Login</button>
          <button type="button">Logout</button>
        </div>
        {/* <button style={{ marginBottom: 12 }} type="button" onClick={() => login()}>Login</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => openWallet()}>Open Wallet</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => deposit(10000, "desc")}>Deposit</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => withdraw(10000, "desc")}>Withdraw</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => getBalance()}>Get balance</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => getListService()}>Get List Service</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => getAccountInfo()}>Get Account Info</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => openService()}>Open Service (Học phí)</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => getListPaymentMethod()}>Get List Payment Method</button>

            <button style={{ marginBottom: 12 }} type="button" onClick={() => pay({ amount: 2000000, orderId: Date.now().toString(), storeId: 24088141, note: 'note' })}>Pay</button> */}

        <WebPaymeSDK ref={refPaymeSDK} configs={configs} />
      </div>
    </>
  );
}

export default App;
