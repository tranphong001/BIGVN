import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import Style
import styles from './Footer.css';
import { getSettings } from '../../AppReducer';

// Import Images
import bg from '../../header-bk.png';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onIntroduction= () => {
    this.context.router.push('/introduction');
    if(window) window.scrollTo(0, 0);
  };
  onRegulation = () => {
    this.context.router.push('/regulation');
    if(window) window.scrollTo(0, 0);
  };
  onSecurity = () => {
    this.context.router.push('/security');
    if(window) window.scrollTo(0, 0);
  };
  onPolicy= () => {
    this.context.router.push('/policy');
    if(window) window.scrollTo(0, 0);
  };
  onContact = () => {
    this.context.router.push('/contact');
    if(window) window.scrollTo(0, 0);
  };
  render() {
    const settings = this.props.settings;
    if (!settings.hasOwnProperty('companyName')) return null;
    if (!settings.hasOwnProperty('MST')) return null;
    if (!settings.hasOwnProperty('mainAddress')) return null;
    if (!settings.hasOwnProperty('SĐT')) return null;
    if (!settings.hasOwnProperty('Email')) return null;
    if (!settings.hasOwnProperty('logoDangKyLink')) return null;
    return (
      <div className={styles.footer}>
        <div className={styles.footerMenu}>
          <a onClick={this.onIntroduction} style={{borderLeft: 'none'}}>Giới thiệu</a>
          <a onClick={this.onRegulation}>Quy chế hoạt động</a>
          <a onClick={this.onSecurity}>Chính sách bảo mật</a>
          <a onClick={this.onPolicy}>Điều khoản sử dụng</a>
          <a onClick={this.onContact}>Liên hệ</a>
        </div>

        <hr className={styles.hrForFooter} />

        <div className={`col-md-12 col-xs-12 ${styles.footerInfo}`}>
          <div className="col-md-5 col-md-offset-3">
            <p>{settings.companyName.value}</p>
            <p>MST: <span>{settings.MST.value}</span></p>
            <p>Địa chỉ: <span>{settings.mainAddress.value}</span></p>
            <p>SĐT: <span>{settings.SĐT.value}</span> - Email: <span>{settings.Email.value}</span></p>
          </div>
          <div className={`col-md-3 text-left ${styles.footerImage}`}>
            <a href={settings.logoDangKyLink.value} target="_blank">
              <img role="presentation" src="images/dangkybct.png"/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: getSettings(state),
  };
}
Footer.propTypes = {
  settings: PropTypes.object.isRequired,
};
Footer.contextTypes = {
  router: PropTypes.object,
};
export default connect(mapStateToProps)(Footer);
