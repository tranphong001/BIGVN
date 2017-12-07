import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../../main.css';
import Item from './Item';
import { fetchRelatedNews } from '../HomeActions';
import { getRelated } from '../HomeReducer';
import cuid from 'cuid';

class Related extends Component {
  constructor(props) {
    super(props);
    this.state = {
      related: [],
    };
  }
  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <div className={styles.relatedTitle}>
          <h3 className={styles.titleDetailPost} style={{ color: 'black', fontSize: '11pt' }}>TIN LIÊN QUAN</h3>
        </div>
        <div className={styles.relatedEvenOut}>
          {
            this.props.related.map((info, index) => (
              <Item key={`${index}Related`} info={info} index={`${index}Related${cuid}`} />
            ))
          }
          {
            (this.props.related.length === 0) ? (
              <div style={{ marginBottom: '20px' }}/>
              ) : ''
          }
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

Related.propTypes = {
  dispatch: PropTypes.func.isRequired,
  related: PropTypes.array.isRequired,
};

Related.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Related);
