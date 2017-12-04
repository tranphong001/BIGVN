import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../main.css';
import grid from '../../grid.css';
import { getServerTime } from '../App/AppReducer';
import numeral from 'numeral';
import cuid from 'cuid';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
    }
  }
  componentDidMount() {
    this.setState({ imgUrl: `/photo/${this.props.info.imageDirectories[this.props.info.thumbnail]}` });
  }
  onClick = (alias) => {
    this.context.router.push(`/${alias}`);
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  capitalizeFirstLetter2 = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  renderTime = (recent) => {
    if (recent.getYear() - 70 > 0) return `${recent.getYear() - 70} năm trước`;
    if (recent.getMonth() > 0) return `${recent.getMonth()} tháng trước`;
    if (recent.getDay() > 0) return `${recent.getDate()} ngày trước`;
    if (recent.getHours() > 0) return `${recent.getHours()} giờ trước`;
    if (recent.getMinutes() > 0) return `${recent.getHours()} phút trước`;
    return `${recent.getSeconds()} giây trước`;
  };
  render() {
    const info = this.props.info;
    const infoTime = new Date(info.dateCreated);
    const recent = new Date( new Date(this.props.serverTime).getTime() - infoTime.getTime());
    return (
      <div className={`${grid.vipClass}`} >
        <a onClick={() => this.onClick(info.alias)}>
          <div
            className={`${styles.vipFrameImage}`}
            style={{
              backgroundImage: `url(${this.state.imgUrl}), url(/photo/default43.jpg)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
          />

          <div
            className={`${styles.vipSub}`}
          >
            <div className={`${styles.vipTitle}`} style={{ paddingLeft: '0', paddingRight: '0' }}>
              <p className={styles.titleTextOverflow} style={{ marginBottom: '0', marginTop: '0' }}>{info.title}</p>
            </div>

            <div className={`${styles.showInMobile}`} style={{ paddingLeft: '0', paddingRight: '0',  paddingBottom: '5px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <span style={{ paddingRight: '20px' }}>
                <i className={`fa fa-map-marker ${styles.blackCharacter}`} aria-hidden="true" style={{ color: 'black' }} />
                <span style={{ color: '#FF7425', paddingLeft: '10px', fontSize: '10pt' }}>{info.city.name}</span>
              </span>

              <span style={{ paddingLeft: '0 !important', paddingRight: '20px' }}>
                <i className={`fa fa-clock-o ${styles.blackCharacter}`} style={{ fontSize: '10pt' }} aria-hidden="true" />
                <span className={`${styles.folderOfPostSpan} ${styles.blackCharacter}`} style={{ paddingLeft: '10px' }}>{this.renderTime(recent)}</span>
              </span>
            </div>

            {
              (info.type === 'news') ? (
                <div style={{ paddingLeft: '0', paddingRight: '0' }}>
                  <p className={styles.vipPrice} style={{ margin: '0' }}>{`${numeral(info.price).format('0,0').replace(/,/g, '.')}đ`}</p>
                </div>
              ) : ''
            }

          </div>
        </a>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    serverTime: getServerTime(state),
  };
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  serverTime: PropTypes.number.isRequired,
};

Home.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Home);
