import { useRef } from 'react';
import './App.css';
import {WebPaymeSDK} from './WebPayME';

const configs = {
  connectToken:
    "bteBmKpT3Hdwr27ygseRoDZTsb1sLyBTCyz1uO5nOavSncaTAlGwXfnJRlIUf4L94VfKQUgDHUr1vcvZPMXYA3elhC+DomnoJliGhWCC17I=",
  appToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Njg2OH0.JyIdhQEX_Lx9CXRH4iHM8DqamLrMQJk5rhbslNW4GzY",
  clientId: "0f816b09bdb040e8",
  env: "dev",
  partner: {
    type: "web",
    paddingTop: 20,
  },
  actions: {
    type: "GET_WALLET_INFO",
  },
  // showLog: "1",
  configColor: ["#00ffff", "#ff0000"],
  // publicKey: appSandbox.publicKey,
  // privateKey: appSandbox.privateKey,
  // xApi: '14'
  xApi: "6868",
}

function App() {
  const refPaymeSDK = useRef(null)

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
  
  return (
    <>
    <div className="App">
      <header className="App-header">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <button style={{marginBottom: 12}} type="button" onClick={() => openWallet()}>Open Wallet</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => deposit(10000, "desc")}>Deposit</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => withdraw(10000, "desc")}>Withdraw</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => getBalance()}>Get balance</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => getListService()}>Get List Service</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => getAccountInfo()}>Get Account Info</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => openService()}>Open Service (Học phí)</button>

          <button style={{marginBottom: 12}} type="button" onClick={() => getListPaymentMethod()}>Get List Payment Method</button>

        </div>

        <WebPaymeSDK ref={refPaymeSDK} configs={configs}  />
      </header>
    </div>
    </>
  );
}

export default App;
