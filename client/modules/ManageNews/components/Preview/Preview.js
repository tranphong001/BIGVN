import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Table, Checkbox, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import style from '../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import numeral from 'numeral';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const info = this.props.info;
    if (!info.hasOwnProperty('contact') ||
        !info.hasOwnProperty('category') ||
        !info.hasOwnProperty('city')
    ) return null;
    const now = Date.now();
    const infoTime = new Date(info.dateCreated);
    const recent = new Date(now - infoTime);
    const imgArr = [];
    info.imageDirectories.map((dir) => {
      imgArr.push({ original: `/photo/${dir}` });
    });
    return (
      <div>
        <div id="title" className="row" style={{ color: '#1D60A6' }}>
          <h3 style={{ margin: '0', paddingBottom: '12px' }}>
            {info.title}
          </h3>
        </div>
        <div className="row" style={{ height: '30px', fontSize: '0.8em' }}>
          <div className="col-md-3" style={{ padding: '0' }}>
            <i className="fa fa-user" aria-hidden="true" />
            <span style={{ textDecoration: 'underline', fontWeight: '700', paddingLeft: '5px' }}>
              {info.contact.name}
            </span>
          </div>
          <div className="col-md-3" style={{ color: '#1D60A6', fontWeight: 'bold' }}>
            <i className="fa  fa-folder-open" aria-hidden="true" />
            <span style={{ padding: '0 3px 0 3px' }}>
              {info.category.title}
            </span>
          </div>
          <div className="col-md-3" style={{ color: '#FF7425' }}>
            <i className="fa fa-map-marker" aria-hidden="true" />
            <span style={{ padding: '0 3px 0 3px' }}>
              {info.city.name}
            </span>
          </div>
          <div className="col-md-3">
            <i className="fa fa-clock-o" aria-hidden="true" />
            <span style={{ padding: '0 3px 0 3px' }}>{recent.getMinutes()} phút trước</span>
          </div>
        </div>
        <div>
          <ImageGallery
            items={imgArr}
            slideInterval={2000}
          />
        </div>
        <div>{`Giá ${numeral(info.price).format('0,0')}`}</div>
        <div
          style={{
            textAlign: 'justify',
            textJustify: 'inter-word',
            lineHeight: '1.5'
          }}
          dangerouslySetInnerHTML={{ __html: info.content }}
        />
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Preview.propTypes = {
  info: PropTypes.object.isRequired,
};

Preview.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Preview);
