import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getCategories, getCities, getDistricts, getWards, getId } from '../../../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../../../App/AppActions';
import { fetchUserNews } from '../../ManageNewsActions';
import { getUserNews } from '../../ManageNewsReducer';
import dateFormat from 'dateformat';
import styles from '../../../../main.css';

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    } else {
      this.props.dispatch(fetchUserNews(this.props.id));
    }
  }
  render() {
    return (
      <div>
        <Table responsive striped bordered condensed hover className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Tiêu đề</th>
              <th style={{ width: '13%' }}>Ngày tạo</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Đã duyệt</th>
              <th style={{ width: '15%' }}>VIP</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.userNews.map((news, index) => {
              const titleTooltip = (
                <Tooltip id="tooltip" label="titleTooltip">{news.title}</Tooltip>
              );
              return (
                <tr key={index}>
                  <td style={{  }} className={styles.titleOverFlow}>
                    <OverlayTrigger placement="top" overlay={titleTooltip}>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{news.title}</p>
                    </OverlayTrigger>
                  </td>
                  <td>{dateFormat(news.dateCreated, 'dd/mm/yyyy HH:mm')}</td>
                  <td style={{ textAlign: 'center' }}>{(news.approved ? 'Đã duyệt' : 'Đang chờ')}</td>
                  <td>
                    {news.vipAll ? 'Toàn trang' : ''}
                    {news.vipCategory ? (news.vipAll ? ', danh mục' : 'Danh mục') : ''}
                    {(!news.vipAll && !news.vipCategory && news.approved) ? 'Tin thường' : ''}
                    {(!news.vipAll && !news.vipCategory && !news.approved) ? '---' : ''}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button bsStyle="primary" style={{ float: 'left' }} bsSize="xs" onClick={() => this.props.onInfo(news)}>Xem trước</Button>
                    <Button bsStyle="primary" style={{ float: 'right' }} bsSize="xs" onClick={() => this.props.onEdit(news)}>Chỉnh sửa</Button>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    userNews: getUserNews(state),
  };
}

NewsList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onInfo: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userNews: PropTypes.array.isRequired,
};

NewsList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(NewsList);
