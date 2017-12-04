import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Modal } from 'react-bootstrap';
import { getCategories, getCities, getDistricts, getWards, getId } from '../../App/AppReducer';
import { setVisibleBlog } from '../../App/AppActions';
import BlogList from '../components/BlogList/BlogList';
import Preview from '../components/Preview/Preview';
import Edit from '../components/Edit/Edit';

class ManageBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfo: false,
      info: {},

      isEdit: false,
      edit: {},
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    } else {
      this.props.dispatch(setVisibleBlog(false));
    }
  }
  onInfo = (info) => {
    this.setState({ isInfo: true, info });
  };
  hideInfo = () => {
    this.setState({ isInfo: false, info: {} });
  };
  onEdit = (edit) => {
    this.setState({ isEdit: true, edit });
  };
  hideEdit = () => {
    this.setState({ isEdit: false, edit: {} });
  };
  render() {
    return (
      <div>
        <BlogList onInfo={this.onInfo} onEdit={this.onEdit} />

        <Modal
          show={this.state.isInfo}
          onHide={this.hideInfo}
        >
          <Modal.Header>
            <Modal.Title>Preview Tin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ padding: '20px' }} >
              <Preview info={this.state.info}/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideInfo}>Thoát</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.isEdit}
          onHide={this.hideEdit}
          bsSize="lg"
        >
          <Modal.Header>
            <Modal.Title>Chỉnh sửa Tin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ padding: '20px' }} >
              <Edit info={this.state.edit}/>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideEdit}>Thoát</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    categories: getCategories(state),
  };
}

ManageBlog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

ManageBlog.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(ManageBlog);
