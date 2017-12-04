import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setNotify, createUser, getCaptcha } from '../App/AppActions';
import { getUserName } from '../App/AppReducer';
import styles from '../../main.css';
class DangKyPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSDT: '',
      matKhau: '',
      nhapLaiMatKhau: '',
      hoTen: '',
      captcha: 'D04DFG',
      nhapLaiCaptcha: '',
      svg: {}
    };
  }
  componentWillMount() {
    if (this.props.userName !== '') {
      this.context.router.push('/');
    }
    this.props.dispatch(getCaptcha()).then((res) => {
      this.setState({ svg: res.captcha });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userName !== '') {
      this.context.router.push('/');
    }
  }
  onSignUp = () => {
    if (!this.kiemTraMatKhau()) {
      this.setState({ error: 'error' });
      this.props.dispatch(getCaptcha()).then((res) => {
        this.setState({ svg: res.captcha });
      });
      return;
    }
    const user = {
      userName: this.state.emailSDT,
      password: this.state.matKhau,
      fullName: this.state.hoTen,
    };
    this.props.dispatch(createUser(user)).then((res) => {
      switch (res.user) {
        case 'success': {
          this.props.dispatch(setNotify('Tạo tài khoản thành công.'));
          this.context.router.push('/signin');
          break;
        }
        case 'error': {
          this.props.dispatch(setNotify('SĐT hoặc email đã được sử dụng.'));
          break;
        }
        case 'missing': {
          this.props.dispatch(setNotify('Thiếu thông tin đăng ký.'));
          break;
        }
        default: {
          this.props.dispatch(setNotify('Đăng ký không thành công.'));
        }
      }
    });
    this.props.dispatch(getCaptcha()).then((res) => {
      this.setState({ svg: res.captcha });
    });
  };

  kiemTraMatKhau = () => {
    let error = '';
    let kq = true;
    if (this.state.emailSDT === '') {
      error += 'Vui lòng nhập Email/ SDT<br />';
      kq = false;
    }
    if (this.state.matKhau === '') {
      error += 'Vui lòng nhập mật khẩu<br />';
      kq = false;
    }
    if (this.state.svg.text !== this.state.nhapLaiCaptcha) {
      error += 'Mã bảo mật không đúng<br />';
      kq = false;
    }
    if (this.state.matKhau !== this.state.nhapLaiMatKhau) {
      error += 'Mật khẩu nhập lại không trùng khớp<br />';
      kq = false;
    }
    if (this.state.hoTen === '') {
      error += 'Vui lòng nhập họ tên';
      kq = false;
    }
    if (error !== '') {
      this.props.dispatch(setNotify(error));
    }
    return kq;
  };

  handleEmailChanged = (eventKey) => { this.setState({ emailSDT: eventKey.target.value }); };
  handleMatKhauChanged = (eventKey) => { this.setState({ matKhau: eventKey.target.value }); };
  handleNhapLaiMatKhauChanged = (eventKey) => { this.setState({ nhapLaiMatKhau: eventKey.target.value }); };
  handleHoTenChanged = (eventKey) => { this.setState({ hoTen: eventKey.target.value }); };
  handleCaptchaChanged = (eventKey) => { this.setState({ captcha: eventKey.target.value }); };
  handleNhapLaiCaptchaChanged = (eventKey) => { this.setState({ nhapLaiCaptcha: eventKey.target.value }); };
  turnToSignIn = () => {
    this.context.router.push('/signin');
  };
  render() {
    return (
      <div>
        <div className={`panel panel-default col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 ${styles.registerContent}`}>
          <div className="col-md-12" style={{ paddingTop: '20px' }}>
            <p className={styles.registerTitle} >ĐĂNG KÝ</p>
            <div className="form-horizontal">
            <div className={styles.inputGroup}>
              <input
                type="text"
                className="form-control"
                placeholder="Email / Số điện thoại"
                style={{ fontSize: '10pt' }}
                value={this.state.emailSDT}
                onChange={this.handleEmailChanged}
              />
            </div >
            <div className={styles.inputGroup}>
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                style={{ fontSize: '10pt' }}
                value={this.state.matKhau}
                onChange={this.handleMatKhauChanged}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu"
                style={{ fontSize: '10pt' }}
                value={this.state.nhapLaiMatKhau}
                onChange={this.handleNhapLaiMatKhauChanged}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className="form-control"
                placeholder="Họ tên"
                style={{ fontSize: '10pt' }}
                value={this.state.hoTen}
                onChange={this.handleHoTenChanged}
              />
            </div>

            <div className={`row ${styles.inputGroup}`} >
              <div className="col-md-6" style={{ marginTop: '8px' }} >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã captcha"
                  style={{ fontSize: '10pt' }}
                  value={this.state.nhapLaiCaptcha}
                  onChange={this.handleNhapLaiCaptchaChanged}
                />
              </div>
              <div className="col-md-6" style={{ paddingLeft: '0px' }} >
                <div dangerouslySetInnerHTML={{ __html: this.state.svg.data }} />
              </div>
            </div>

            <div className={styles.inputGroup} >
              <button onClick={() => { this.onSignUp(); }} className={styles.inputRegistryButton} >ĐĂNG KÝ</button>
            </div>
            <div className={`text-center ${styles.inputGroup}`} >
              <p>
                <span style={{ fontSize: '10pt' }}>Bạn đã có tài khoản? </span>
                <span style={{ fontSize: '10pt' }}><a onClick={this.turnToSignIn} className={styles.loginNow}>Đăng nhập ngay</a></span>
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    userName: getUserName(state),
  };
}

DangKyPages.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

DangKyPages.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DangKyPages);
