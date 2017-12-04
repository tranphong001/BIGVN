import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Item from './Item';
import {getNewsList, getLoading, getNewsVipList, getCurrentPage, getMaxPage } from '../HomeReducer';
import { fetchVipCategory, fetchNews, addVipCategory } from'../../App/AppActions';
import { getPageHeader } from'../../App/AppReducer';
import CircularProgress from 'material-ui/CircularProgress';
import styles from '../../../main.css';
import grid from '../../../grid.css';
import { Pagination } from 'react-bootstrap';
import {setCurrentPage} from "../HomeActions";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleSelect = (eventKey) => {
    this.props.dispatch(setCurrentPage(eventKey));
  };
  render() {
    return (
      <div>
        <div className={`col-md-12 col-xs-12 ${styles.listHeader}`} style={{ paddingLeft: '0', paddingTop: '0', fontSize: '11pt', fontWeight: 'bold', paddingBottom: '20px' }}>
          {this.props.pageHeader}
        </div>
        <div className="col-md-12 col-xs-12" style={{ paddingLeft: '0', paddingRight: '0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {
            this.props.loading ? (
              <div style={{ paddingTop: '20px' }}>
                <CircularProgress  size={160} thickness={5} />
              </div>
              ) : ''
          }
          {
            (this.props.newsVipList.length > 0 ) ? (
              this.props.newsVipList.map((info, index) => (
                <div className={grid.itemList} key={`${index}VipCate`}>
                  <Item info={info} />
                  <hr className={styles.hrClass} />
                </div>
              ))
            ) : ''
          }
          {
            this.props.newsList.map((info, index) => (
              <div className={grid.itemList} key={`${index}VipCate`}>
                <Item info={info} />
                <hr className={styles.hrClass} />
              </div>
            ))
          }
        </div>
        <div style={{ margin: 'auto', marginBottom: '10px' }}>
          <Pagination
            bsSize="small"
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.maxPage}
            maxButtons={5}
            activePage={this.props.currentPage}
            onSelect={this.handleSelect}
            style={{
              display: 'table',
              margin: 'auto'
            }}
          />
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    newsList: getNewsList(state),
    newsVipList: getNewsVipList(state),
    loading: getLoading(state),
    pageHeader: getPageHeader(state),
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
  };
}

List.propTypes = {
  dispatch: PropTypes.func.isRequired,
  newsList: PropTypes.array.isRequired,
  newsVipList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pageHeader: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
};

List.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(List);
