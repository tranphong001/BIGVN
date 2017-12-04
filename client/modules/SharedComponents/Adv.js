import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../main.css';
import style from '../Home/pages/Home.css';
class Adv extends Component {
  constructor(props) {
    super(props);
  }
  onClick = (alias) => {
    this.context.router.push(`/${alias}`);
  };
  render() {
    if (this.props.banners === undefined) return null;
    const r1 = this.props.banners.r1;
    const r2 = this.props.banners.r2;
    const r3 = this.props.banners.r3;
    return (
      <div className={`${styles.advWidth} col-xs-12`}>
        {
          (r1 && r1.hasOwnProperty('name')) ? (
            <div style={{ paddingBottom: '6px' }}>
              <a href={r1.link} target="_blank" style={{ paddingBottom: '20px' }}>
                <div
                  style={{
                    backgroundImage: `url(/banner/${r1.imageDirectory})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300px 250px',
                    width: '300px',
                    height: '250px',
                    margin: 'auto'
                  }}
                />
              </a>
            </div>
          ) : ''
        }
        {
          (r2 && r2.hasOwnProperty('name')) ? (
            <div style={{ paddingBottom: '6px' }}>
              <a className={styles.advNotShowInMobile} href={r2.link} target="_blank" style={{ paddingBottom: '20px' }} >
                <div
                  style={{
                    backgroundImage: `url(/banner/${r2.imageDirectory})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300px 250px',
                    width: '300px',
                    height: '250px',
                  }}
                />
              </a>
            </div>
          ) : ''
        }
        {
          (r3 && r3.hasOwnProperty('name')) ? (
            <div style={{ marginBottom: '6px' }}>
              <a className={styles.advNotShowInMobile} href={r3.link} target="_blank" style={{ paddingBottom: '20px' }} >
                <div
                  style={{
                    backgroundImage: `url(/banner/${r3.imageDirectory})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300px 600px',
                    width: '300px',
                    height: '600px',
                  }}
                />
              </a>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Adv.propTypes = {
  dispatch: PropTypes.func.isRequired,
  banners: PropTypes.object.isRequired,
};

Adv.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Adv);
