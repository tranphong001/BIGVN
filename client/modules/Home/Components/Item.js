import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DangTinPages from '../../DangTin/DangTinPages';
import styles from '../../../main.css';
import grid from '../../../grid.css';
import dateFormat from 'dateformat';
import { getServerTime } from '../../App/AppReducer';
import { setPageHeader, setMenuHeader, setSearchCity, setIsTyping } from '../../App/AppActions';
import { getCurrentPage } from '../HomeReducer';
import numeral from 'numeral';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: ''
    };
    this.isNotOnFrame = true;
  }
  componentDidMount() {
    this.setState({ imgUrl: (this.props.info.imageDirectories.length > 0) ? `/photo/${this.props.info.imageDirectories[this.props.info.thumbnail]}` : '/photo/default43.jpg'});
  }
  handleClick = () => {
    if (this.isNotOnFrame) {
      this.context.router.push(`/${this.props.info.alias}`);
      this.props.dispatch(setIsTyping(false));
    } else {
      this.isNotOnFrame = true;
    }
  };
  onCategoryTop = (info) => {
    this.isNotOnFrame = false;
    this.props.dispatch(setMenuHeader(info.title));
    this.props.dispatch(setPageHeader(info.title));
    this.context.router.push(`/${info.alias}`);
  };
  capitalizeFirstLetter = (string) => {
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
  onCityTop = (city) => {
    this.isNotOnFrame = false;
    this.props.dispatch(setSearchCity(city._id));
    this.props.dispatch(setPageHeader(city.name.toUpperCase()));
  };
  render() {
    const info = this.props.info;
    const infoTime = new Date(info.dateCreated);
    const recent = new Date( new Date(this.props.serverTime).getTime() - infoTime.getTime());
    return (
      <div className={grid.itemParent} onClick={this.handleClick}>
        <div
          className={`${styles.itemImage}`}
          style={{
            backgroundImage: `url(${this.state.imgUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        />

        <div className={grid.itemContent}>
          <div className={styles.vipImageItem} style={{ visibility: (info.vipCategory) ? 'visible' : 'hidden' }}>
            <img role="presentation" src="images/VIP2.png" className={styles.imgthumpVipIcon} />
          </div>
          <div id="title" style={{ paddingLeft: '0', marginTop: '-2px', width: '93%' }}>
            <p style={{ color: '#1c60a7', fontSize: '16px', textOverflow: 'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap' }}>
              {info.title}
            </p>
          </div>
          <div className={`${styles.infoOfPost}`} style={{ paddingLeft: '0', marginTop: '6px' }}>
            {
              (info.hasOwnProperty('contact')) ? (
                <span className={`${styles.notShowInMobile}`}  style={{ paddingLeft: '0 !important', paddingRight: '20px' }}>
                  <i className={`fa fa-user ${styles.blackCharacter}`} style={{ fontSize: '11px' }} aria-hidden="true" />
                  <span style={{ color: 'rgba(17, 17, 17, 255)', paddingLeft: '5px', fontSize: '11px', cursor: 'normal' }}>{info.contact.name}</span>
                </span>
              ) : ''
            }
            {
              (info.hasOwnProperty('category')) ? (
                <span style={{ paddingLeft: '0 !important', paddingRight: '20px' }}>
                  <i className={`fa fa fa-folder-open ${styles.blackCharacter}`} style={{ fontSize: '11px' }} aria-hidden="true" />
                  <a onClick={() => this.onCategoryTop(info.category)} style={{ zIndex: 1, textDecoration: 'none', color: 'rgb(28,96,167)', paddingLeft: '5px', fontSize: '11px' }}>{this.capitalizeFirstLetter(info.category.title)}</a>
                </span>
              ) : ''
            }
            {
              (info.hasOwnProperty('topic')) ? (
                <span style={{ paddingLeft: '0 !important', paddingRight: '20px' }}>
                  <i className={`fa fa-folder-open ${styles.blackCharacter}`} style={{ fontSize: '11px' }} aria-hidden="true" />
                  <a onClick={() => this.onCategoryTop(info.topic)} style={{ color: 'rgb(28,96,167)', textDecoration: 'none', paddingLeft: '5px', fontSize: '11px' }}>{this.capitalizeFirstLetter(info.topic.title)}</a>
                </span>
              ) : ''
            }
            {
              (info.hasOwnProperty('city')) ? (
                <span style={{ paddingRight: '20px' }}>
                <i className={`fa fa-map-marker ${styles.blackCharacter}`} aria-hidden="true" style={{ color: 'black' }} />
                <a onClick={() => this.onCityTop(info.city)} style={{ color: '#FF7425', paddingLeft: '5px', textDecoration: 'none', fontSize: '11px' }}>{info.city.name}</a>
              </span>
              ) : ''
            }
            <span className={styles.showInDesktop} style={{ paddingRight: '0' }}>
              <i className="fa fa-clock-o" aria-hidden="true" style={{ color: 'black' }} />
              <span style={{ fontSize: '11px', color: 'rgba(17, 17, 17, 255)'}}>{` ${this.renderTime(recent)}`}</span>
            </span>
            <div className={styles.showInMobile} style={{ paddingRight: '0', marginTop: '5px' }}>
              <i className="fa fa-clock-o" aria-hidden="true" style={{ color: 'black' }} />
              <span style={{ fontSize: '11px', color: 'rgba(17, 17, 17, 255)'}}>{` ${this.renderTime(recent)}`}</span>
            </div>
          </div>

          {
            (info.type === 'news') ? (
              <div className={`${styles.showInMobile}`}
                   style={{paddingLeft: '0', height: '15px', marginTop: '5px' }}>
                <p className={styles.itemPrice} style={{
                  marginBottom: '0',
                  marginTop: '0',
                }}>
                  {`${numeral(info.price).format('0,0').replace(/,/g, '.')}đ`}
                </p>
              </div>
            ) : ''
          }

          <div className={styles.summaryNotIn480} style={{ paddingLeft: '0', paddingRight: '0', marginTop: '15px' }}>
            {
              (info.type === 'news') ? (
                <div
                  style={{
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    height: '38px',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    textOverflow: 'ellipsis',
                  }}
                  className={styles.summary}
                  dangerouslySetInnerHTML={{ __html: info.content.substr(0, 200) }}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    height: '38px',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    textOverflow: 'ellipsis',
                  }}
                  className={styles.summary}
                >
                  <p style={{ height: '38px',textDecoration: 'none', cursor: 'pointer' }}>
                    {info.summary}
                  </p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    serverTime: getServerTime(state),
    currentPage: getCurrentPage(state),
  };
}

Item.propTypes = {
  dispatch: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  serverTime: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};

Item.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Item);
