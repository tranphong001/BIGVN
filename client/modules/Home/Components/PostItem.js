import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DangTinPages from '../../DangTin/DangTinPages';
import styles from '../../../main.css';
class PostItem extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    this.context.router.push(`/${this.props.info.alias}`);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  renderTime = (recent) => {
    if (recent.getYear() - 70 > 0) return `${recent.getYear()} năm trước`;
    if (recent.getMonth() > 0) return `${recent.getMonth()} tháng trước`;
    if (recent.getDate() > 0) return `${recent.getDate()} ngày trước`;
    if (recent.getHours() > 0) return `${recent.getHours()} giờ trước`;
    return `${recent.getMinutes()} phút trước`;
  };
  render() {
    const info = this.props.info;
    if (!info.hasOwnProperty('contact') ||
      !info.hasOwnProperty('city') ||
      !info.hasOwnProperty('category')
    ) return null;
    const now = Date.now();
    const infoTime = new Date(info.dateCreated);
    const recent = now - infoTime;
    return (
      <div className={`row ${styles.postItem}`}>
        <div className={styles.vipImage} style={{ visibility: (info.vip === 'none') ? 'hidden' : 'visible' }}>
          <img role="presentation" src="images/VIP2.png" className={styles.imgthump} />
        </div>
        <div className="col-md-3" style={{ paddingLeft: '0' }}>
          <img
            role="presentation" className={styles.imgthump}
            src={(info.imageDirectories.length > 0) ? `/photo/${info.imageDirectories[0]}` : '/photo/default43.jpg'}
          />
        </div>
        <div className="col-md-9">
          <a onClick={this.handleClick} className={styles.linkNoneUnderLine}>
            <div id="title" className="row">
              <h3 className={styles.titlePost}>
                {info.title}
              </h3>
            </div>
          </a>
          <div className={`row ${styles.infoOfPost}`}>
            <span style={{ paddingLeft: '0 !important', paddingRight: '10px' }}>
              <i className="fa fa-user" aria-hidden="true" />
              <span className={styles.detailPost}>
                {info.contact.name}
              </span>
            </span>
            <span style={{ color: '#FF7425', paddingRight: '10px' }}>
              <i className="fa fa-map-marker" aria-hidden="true" />
              <span className={styles.folderOfPostSpan}>
                {info.city.name}
              </span>
            </span>
            <span style={{ paddingRight: '10px' }}>
              <i className="fa fa-clock-o" aria-hidden="true" />
              <span className={styles.folderOfPostSpan}>{this.renderTime(recent)}</span>
            </span>
          </div>
          <div className={styles.contentOverFlow}>
            <p className={`row ${styles.textJustify}`}>
              {info.summary}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

PostItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
};

PostItem.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(PostItem);
