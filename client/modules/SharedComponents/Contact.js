import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VIP from './VIP';
import Adv from './Adv';
import { fetchCategories, setVisibleBlog, setPageHeader } from '../App/AppActions';
import { getId, getCategories, getBanners, getTopics, getVipAll } from '../App/AppReducer';
import styles from '../../main.css';
import grid from '../../grid.css';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'none',
      alias: '',

      oldParams: {},
    };
  }
  render() {
    return (
      <div className="container">
        <div className={`${grid.contentWidth} col-xs-12`}>
          Contact
        </div>

        <div className={`${styles.vipWidth} col-xs-12 ${styles.vipSection}`}>
          <div style={{ padding: '12px 0 25px 10px' }}>
            <i className={`fa fa-star ${styles.vipStar}`} aria-hidden="true" />
            <span className={styles.vipTitle}>TIN VIP</span>
          </div>
          <div style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-between' }}>
            {
              this.props.vipAll.map((vip, index) => (
                <VIP info={vip} key={`${index}Vip`} index={index} />
              ))
            }
          </div>
        </div>
        <Adv banners={this.props.banners} />
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    categories: getCategories(state),
    topics: getTopics(state),
    banners: getBanners(state),
    vipAll: getVipAll(state),
  };
}

Contact.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  banners: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  vipAll: PropTypes.array.isRequired,
  params: PropTypes.object,
};

Contact.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Contact);
