import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <h2>Rất tiếc</h2>
        <p>
          Tin bạn tìm không tồn tại
        </p>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

NotFound.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

NotFound.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(NotFound);
