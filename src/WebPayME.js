import { Component } from 'react';
import {PaymeWebSdk} from './PaymeSDK'

export class WebPaymeSDK extends Component {
  constructor(props) {
      super(props)
      this.state = {
        iframeVisible: { state: false, hidden: false }
      }
      this.configs = props.configs
      // eslint-disable-next-line no-undef
      this._webPaymeSDK = new PaymeWebSdk(props.configs, {id: 'paymeId'});
  }

  openWallet = () => {
    this.setState({
      iframeVisible: { state: true, hidden: false },
    })

    this._webPaymeSDK.openWallet().then(res => {
      if (res.type === 'onClose') {
        this.setState({
          iframeVisible: { state: false, hidden: false },
        })
      }
    }).catch(err => console.log(err))
  }

  deposit = (param) => {
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

  getBalance = (callback) => {
    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getBalance().then(res => callback(res)).catch(err => console.log(err))
  }

  getListService = (callback) => {
    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getListService().then(res => callback(res)).catch(err => console.log(err))
  }

  getAccountInfo = (callback) => {
    this.setState({
      iframeVisible: { state: true, hidden: true },
    })

    this._webPaymeSDK.getAccountInfo().then(res => callback(res)).catch(err => console.log(err))
  }

  openService = () => {
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