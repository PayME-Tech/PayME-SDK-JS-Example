import { Component } from 'react';
import {PaymeWebSdk} from './PaymeSDK'

export class WebPaymeSDK extends Component {
  constructor(props) {
      super(props)
      this.state = {
        iframeVisible: { state: false, hidden: false } // Biến dùng để bật tắt iFreame
      }
      this.configs = props.configs
      this.isLogin = false
      // eslint-disable-next-line no-undef
      this._webPaymeSDK = new PaymeWebSdk(props.configs, {id: 'paymeId'});
  }

  _checkActiveAndKyc = () => {
    if (this.configs?.accountStatus !== 'KYC_OK') {
      alert(this.configs?.accountStatus)
      return false
    }
    return true
  }

  login = (callback) => {
    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.login()
    .then(res => {
      if (res) {
        const newConfigs = {
          ...this.configs,
          ...res
        }
        this.configs = newConfigs
        this._webPaymeSDK = new PaymeWebSdk(newConfigs, {id: 'paymeId'})
        this.isLogin = true
      }
      console.log('ressss', res)
      callback(res)
    })
    .catch(err => console.log(err))
  }


  openWallet = () => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false },
    })

    this._webPaymeSDK.openWallet().then(res => {
      console.log('ressss', res)
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  deposit = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false },
    })

    this._webPaymeSDK.deposit(param).then(res => {
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  withdraw = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false },
    })
    
    this._webPaymeSDK.withdraw(param).then(res => {
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  pay = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false },
    })
    
    this._webPaymeSDK.pay(param).then(res => {
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  getBalance = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getBalance().then(res => callback(res)).catch(err => console.log(err))
  }

  getListService = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getListService().then(res => callback(res)).catch(err => console.log(err))
  }

  getAccountInfo = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getAccountInfo().then(res => callback(res)).catch(err => console.log(err))
  }

  openService = () => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false },
    })
    
    this._webPaymeSDK.openService('HOCPHI').then(res => {
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  getListPaymentMethod = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getListPaymentMethod().then(res => callback(res)).catch(err => console.log(err))
  }

  render() {
    const { iframeVisible } = this.state
    const {hidden} = iframeVisible
    const styleVisible = {
      display: 'block',
      position: 'fixed',
      top: 0,
      with: '100%',
      height: '100%'
    }

    const styleHidden = {
      display: 'none'
    }

    if (!iframeVisible.state) return null
    return (
      <div style={hidden ? styleHidden: styleVisible} id='paymeId' />
    )
  }    
}