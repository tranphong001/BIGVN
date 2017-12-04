import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { facebookLogin, googleLogin, loginUser } from '../App/AppActions';
import { getUserName } from '../App/AppReducer';
import styles from '../../main.css';
import grid from '../../grid.css';
class DangNhapPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSDT: '',
      matKhau: '',

      remember: false,
      error: ''
    };
  }
  componentWillMount() {
    if (this.props.userName !== '') {
      this.context.router.push('/');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.userName !== '') {
      this.context.router.push('/');
    }
  }
  onSignIn = () => {
    const user = {
      userName: this.state.emailSDT,
      password: this.state.matKhau,
    };
    this.props.dispatch(loginUser(user, this.state.remember)).then((res) => {
      if (res.user !== 'unknown' && res.user !== 'missing') {
        this.setState({ error: 'error' });
      } else {
        this.setState({ error: '' });
      }
    });
  };
  handleEmailChanged = (eventKey) => { this.setState({ emailSDT: eventKey.target.value }); };
  handleMatKhauChanged = (eventKey) => { this.setState({ matKhau: eventKey.target.value }); };
  signInByFacebook =() => {
    this.props.dispatch(facebookLogin(this.state.remember));
  };
  signInByGoogle =() => {
    this.props.dispatch(googleLogin(this.state.remember));
  };
  turnToSignUp = () => {
    this.context.router.push('/signup');
  };
  handleRemember = () => { this.setState({ remember: !this.state.remember }); };
  render() {
    return (
      <div>
        <div className={`panel panel-default col-sm-8 col-sm-offset-2 col-md-5 ${grid.loginLogoutPage}`}>
        <div style={{ padding: '20px' }}>
          <p className={styles.signInTitle}>ĐĂNG NHẬP</p>
          <div style={{ paddingTo: '10px' }}>
            <button onClick={this.signInByFacebook} className={styles.signInWithFacebook}>
              <i style={{ position: 'absolute' }} className="fa fa-facebook" aria-hidden="true" />
              <span style={{fontSize: '11pt' }}> Đăng nhập bằng Facebook</span>
            </button>
          </div>
          <div style={{ marginBottom: '30px' }}>
            <button onClick={this.signInByGoogle} className={styles.signInWithGoogle}>
              <i style={{ position: 'absolute' }} className="fa fa-google-plus" aria-hidden="true" />
              <span style={{fontSize: '11pt' }}>Đăng nhập bằng Google</span>
            </button>
          </div>
          <div className="text-center">
            <hr className="hr-over" />
            <span className={styles.spanOverHr}>
              <span className="ng-scope" style={{fontSize: '11pt' }}>Hoặc đăng nhập bằng Email/Số điện thoại</span>
            </span>
          </div>
          <div className="form-horizontal">
            <div className={styles.inputGroup} style={{ marginTop: '-10px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Email/ Số điện thoại"
                style={{fontSize: '10pt' }}
                value={this.state.emailSDT}
                onChange={this.handleEmailChanged}
                onKeyDown={this.onSignIn}
              />
            </div>
            <div className={styles.inputGroup} >
              <input
                type="password"
                className="form-control"
                placeholder="Mật khẩu"
                style={{ fontSize: '10pt' }}
                value={this.state.matKhau}
                onChange={this.handleMatKhauChanged}
                onKeyDown={this.onSignIn}
              />
            </div>
            <div className={`row form-group ${styles.inputGroup}`} >
              <div className="col-md-6" >
                <label className="clearfix">
                  <input type="checkbox" checked={this.state.remember} onChange={this.handleRemember} style={{ marginRight: '10px', fontSize: '10pt' }} />
                  Ghi nhớ mật khẩu
                </label>
              </div>

              <div className="col-md-6">
                <a href="#" className={`form-control ${styles.checkboxSignIn}`} style={{ fontSize: '10pt' }}>Bạn quên mật khẩu?</a>
              </div>
            </div>
            <div className="text-center" >
              <button onClick={this.onSignIn} className={styles.inputSignInButton}>
                ĐĂNG NHẬP
              </button>
            </div>
            <div className={`${styles.inputGroup} text-center`}>
              <p>
                <span style={{ fontSize: '10pt' }}>Bạn đã có tài khoản? </span>
                <span style={{ fontSize: '10pt' }}><a onClick={this.turnToSignUp} className={styles.registerNowSpan}>Đăng ký ngay</a></span>
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

DangNhapPages.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

DangNhapPages.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DangNhapPages);
