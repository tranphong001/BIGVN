import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import style from '../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import numeral from 'numeral';
import { fetchNewsByAlias } from '../HomeActions';
import { getNews } from '../HomeReducer';
import styles from '../../../main.css';
import { getBanners, getServerTime } from '../../App/AppReducer';
import { setVisibleBlog, setMenuHeader, setPageHeader, setSearchCity } from '../../App/AppActions';
import NotFound from '../../NotFound/NotFound';
import CircularProgress from 'material-ui/CircularProgress';
import dateFormat from 'dateformat';
import { Breadcrumb } from 'react-bootstrap';

import Related from './Related';
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
  }
  onBreadcrumb = (link) => {
    this.context.router.push(`/${link}`);
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  capitalizeFirstLetter2 = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  renderTime = (recent) => {
    if (recent.getYear() - 70 > 0) return `${recent.getYear() - 70} năm trước`;
    if (recent.getMonth() > 0) return `${recent.getMonth()} tháng trước`;
    if (recent.getDay() > 0) return `${recent.getDate()} ngày trước`;
    if (recent.getHours() > 0) return `${recent.getHours()} giờ trước`;
    if (recent.getMinutes() > 0) return `${recent.getHours()} phút trước`;
    return `${recent.getSeconds()} giây trước`;
  };
  onCategoryTop = (info) => {
    this.props.dispatch(setMenuHeader(info.title));
    this.props.dispatch(setPageHeader(info.title));
    this.context.router.push(`/${info.alias}`);
  };
  onCityTop = (city) => {
    this.props.dispatch(setSearchCity(city._id));
    this.props.dispatch(setPageHeader(city.name.toUpperCase()));
    this.context.router.push('/');
  };
  render() {
    const info = this.props.news;
    if (!info.hasOwnProperty('topic') &&
      !info.hasOwnProperty('category')
    ) return (
      <div className="text-center">
        <CircularProgress  size={160} thickness={5} />
      </div>
    );
    if (info === '404') return <NotFound />;
    const now = Date.now();
    const infoTime = new Date(info.dateCreated);
    const recent = new Date( new Date(this.props.serverTime).getTime() - infoTime.getTime());
    const imgArr = [];
    info.imageDirectories.map((dir) => {
      imgArr.push({ original: `/photo/${dir}`, thumbnail: `/photo/${dir}` });
    });
    // if (info.type === 'blog') {
    //   this.props.dispatch(setVisibleBlog(true));
    // }
    const r4 = this.props.banners['r4'];
    const r5 = this.props.banners['r5'];
    return (
      <div className={styles.detailPaddingDiv}>
        <div className={`row ${styles.evenOut}`}>
        {
          (info.type === 'news') ? (
            <Breadcrumb
              className={styles.customBreadcrumb}
            >
              <Breadcrumb.Item onClick={() => this.onBreadcrumb('')} style={{ color: '#000'}}>
                Trang chủ
              </Breadcrumb.Item>
              <Breadcrumb.Item onClick={() => this.onBreadcrumb(`/${info.category.alias}`)} active style={{ color: 'blue' }}>
                {info.category.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          ): ''
        }
        </div>
        <div id="title" className={`row ${styles.evenOut}`}>
          <h4 className={styles.titleDetailPost}>
            {this.capitalizeFirstLetter(info.title)}
          </h4>
        </div>
        <div className={`row ${styles.infoOfPost2} ${styles.evenOut}`} >
          {
            (info.hasOwnProperty('contact')) ? (
              <span className={`${styles.padding0}`}>
                <i className="fa fa-user" aria-hidden="true" style={{ paddingRight: '5px' }} />
                <span className={styles.detailPost}>{info.contact.name}</span>
              </span>
            ) : ''
          }
          {
            (info.hasOwnProperty('category')) ? (
              <span className={`${styles.folderOfPost}`} >
                <i className="fa  fa-folder-open" aria-hidden="true" style={{ color: '#000', paddingRight: '5px' }} />
                <a onClick={() => this.onCategoryTop(info.category)}  className={styles.folderOfPostSpan} style={{ color: 'rgb(28,96,167)' }}>{this.capitalizeFirstLetter(info.category.title)}</a>
              </span>
            ) : ''
          }
          {
            (info.hasOwnProperty('topic')) ? (
              <span className={`${styles.folderOfPost}`} >
                <i className="fa  fa-folder-open" aria-hidden="true" style={{ color: '#000', paddingRight: '5px' }} />
                <a onClick={() => this.onCategoryTop(info.topic)}  className={styles.folderOfPostSpan} style={{ color: '#1D60A6' }}>{this.capitalizeFirstLetter(info.topic.title)}</a>
              </span>
            ) : ''
          }
          {
            (info.hasOwnProperty('city')) ? (
              <span className={`${styles.postCityTitle}`}>
                <i className="fa fa-map-marker" aria-hidden="true" style={{ color: 'black', paddingRight: '5px' }} />
                <a onClick={() => this.onCityTop(info.city)} className={styles.folderOfPostSpan} style={{ color: '#FF7425' }}>{info.city.name}</a>
              </span>
            ) : ''
          }
          <span>
            <i className="fa fa-clock-o" aria-hidden="true" style={{ paddingRight: '5px' }}/>
            <span className={styles.folderOfPostSpan}>{this.renderTime(recent)}</span>
          </span>
        </div>
        {
          (info.type === 'news') ? (
            <div style={{ width: '80%', margin: 'auto', paddingTop: '15px' }}>
              <ImageGallery
                items={imgArr}
                slideInterval={2000}
                onImageLoad={this.handleImageLoad}
                showFullscreenButton={false}
                showBullets
                showPlayButton={false}
              />
            </div>
          ) : ''
        }
        {
          (info.type === 'news') ? (
            <div style={{ padding: '20px 20px 0px 0' }}>
              <span style={{ color: '#2F6FAE', fontWeight: 'bold' }}>Giá: </span>
              <span style={{ fontWeight: 'bold', fontSize: '16pt' }}>{`${numeral(info.price).format('0,0').replace(/,/g, '.')}đ`}</span>
            </div>
            ) : ''
        }
        <hr style={{ marginTop: '5px', marginBottom: '5px'}} />
        <div
          style={{
            textAlign: 'justify',
            textJustify: 'inter-word',
            paddingBottom: '20px'
          }}
          className={styles.contentDiv}
          dangerouslySetInnerHTML={{ __html: info.content }}
        />
        <div style={{ display: 'flex' }} className={styles.advertiseInDetail}>
        {
          (r4 && r4.hasOwnProperty('name')) ? (
            <div
              className={styles.r4r5}
              style={{
                backgroundImage: `url(/banner/${r4.imageDirectory})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'right',
                marginRight: '2px',
              }}
            >
              <a href={r4.link} target="_blank" style={{ marginLeft: 'auto' }}>
              </a>
            </div>
            ) : ''
        }
        {
          (r5 && r5.hasOwnProperty('name')) ? (
            <div
              className={styles.r4r5}
              style={{
                backgroundImage: `url(/banner/${r5.imageDirectory})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'left',
                marginLeft: '2px',
              }}
            >
              <a href={r5.link} target="_blank" style={{ marginRight: 'auto' }}>
              </a>
            </div>
            ) : ''
        }
        </div>
        <Related alias={this.props.alias} />
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    banners: getBanners(state),
    news: getNews(state),
    serverTime: getServerTime(state),
  };
}

Detail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
  news: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  alias: PropTypes.string.isRequired,
  serverTime: PropTypes.number.isRequired,
};

Detail.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Detail);
