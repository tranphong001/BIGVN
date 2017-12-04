import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { fetchCategories } from '../../App/AppActions';
import { getId, getCategories } from '../../App/AppReducer';

class Multiple extends Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'none',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.length > 0) {
      const pathname = nextProps.location.pathname;
      const alias = pathname.substr(1, pathname.length);
      const stt = nextProps.categories.filter((cate) => {
        return alias === cate.alias;
      });
      if (stt.length > 0) {
        this.setState({type: 'category'});
      } else {
        this.setState({type: 'detail'});
      }
    }
  }
  componentDidMount() {
    if (this.props.location && this.props.categories.length > 0) {
      console.log(this.state.type);
      const pathname = this.props.location.pathname;
      const alias = pathname.substr(1, pathname.length);
      const stt = this.props.categories.filter((cate) => { return alias === cate.alias; });
      console.log(stt);
      if (stt.length > 0) {
        this.setState({ type: 'category' });
      } else {
        this.setState({ type: 'detail' });
      }
    }
  }
  render(){
    if (this.state.type === 'none') return null;
    if (this.props.categories.length == 0) return null;
    return (
      <div>
        {
          (this.state.type === 'category') ? (
              'this is category'
            ) : ''
        }
        {
          (this.state.type === 'detail') ? (
              'this is detail'
            ) : ''
        }
      </div>
    );
  }
}

Multiple.need = [() => { return fetchCategories(); }];

function mapStateToProps(state) {
  return {
    id: getId(state),
    categories: getCategories(state),
  };
}
Multiple.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
};
Multiple.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Multiple);
