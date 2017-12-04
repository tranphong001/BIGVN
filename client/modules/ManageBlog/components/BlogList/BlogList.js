import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getTopics, getId } from '../../../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../../../App/AppActions';
import { fetchUserBlogs } from '../../ManageBlogActions';
import { getUserBlogs } from '../../ManageBlogReducer';
import dateFormat from 'dateformat';
import styles from '../../../../main.css';

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    } else {
      this.props.dispatch(fetchUserBlogs(this.props.id));
    }
  }
  render() {
    return (
      <div>
        <Table striped responsive bordered condensed hover className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Tiêu đề</th>
              <th style={{ width: '15%' }}>Ngày tạo</th>
              <th style={{ width: '15%' }}>Đã duyệt</th>
              <th style={{ width: '30%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.userBlogs.map((blog, index) => {
              const titleTooltip = (
                <Tooltip id="tooltip" label="titleTooltip">{blog.title}</Tooltip>
              );
              return (
                <tr key={index}>
                  <td style={{ width: '40%' }} className={styles.titleOverFlow}>
                    <OverlayTrigger placement="top" overlay={titleTooltip}>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{blog.title}</p>
                    </OverlayTrigger>
                  </td>
                  <td style={{ width: '15%' }}>{dateFormat(blog.dateCreated, 'dd/mm/yyyy HH:mm')}</td>
                  <td style={{ width: '15%' }}>{(blog.disable ? 'Đang khóa' : 'Đang mở')}</td>
                  <td style={{ width: '10%' }}>
                    <Button bsStyle="primary" style={{ float: 'left' }} bsSize="xs" onClick={() => this.props.onInfo(blog)}>Xem trước</Button>
                    <Button bsStyle="primary" style={{ float: 'right' }} bsSize="xs" onClick={() => this.props.onEdit(blog)}>Chỉnh sửa</Button>
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
    userBlogs: getUserBlogs(state),
    topics: getTopics(state),
  };
}

BlogList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onInfo: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userBlogs: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
};

BlogList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(BlogList);
