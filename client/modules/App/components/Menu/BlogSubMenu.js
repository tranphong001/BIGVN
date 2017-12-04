import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Menu.css';
import { Navbar, Nav, NavItem, Button, Glyphicon, NavDropdown, MenuItem } from 'react-bootstrap';
import {fetchCategories, setIsTyping, setPageHeader, setSearchCity} from '../../AppActions';
import { getUserName, getId, getFullName, getCategories, getTopics, getVisibleBlog, getExpanded } from '../../AppReducer';
import main from '../../../../main.css';

class BlogSubMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'home',
      selectedBlog: 'blogs',
    };
  }
  onTopic = (alias, title) => {
    this.context.router.push(`/${alias}`);
    this.props.dispatch(setPageHeader(title.toUpperCase()));
    this.props.dispatch(setIsTyping(false));
    this.props.dispatch(setSearchCity(''));
    this.setState({ selectedBlog: alias });
  };
  capitalizeFirstLetter2 = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  render() {
    if (!this.props.visibleBlog) return <div style={{ marginBottom: '15px' }} />;
    return (
      <Navbar
        className={styles.navbar2}
        collapseOnSelect
        defaultExpanded={false}
        onToggle={() => {
        }}
      >
          <Nav style={{ width: '100%' }}>
            <a onClick={() => this.onTopic('blogs', 'BÀI VIẾT MỚI NHẤT')} style={{color: 'white'}}>
              <span className={`${main.blogMenuItem} ${(this.state.selectedBlog === 'blogs') ? (main.blogSelected) : ''}`}>
                Tất cả
              </span>
            </a>
            {
              this.props.topics.map((topic, index) => {
                return (
                  <a key={index} onClick={() => this.onTopic(topic.alias, topic.title)} style={{color: 'white'}}>
                  <span className={`${main.blogMenuItem} ${(this.state.selectedBlog === topic.alias) ? (main.blogSelected) : ''}`}>
                    {this.capitalizeFirstLetter2(topic.title)}
                  </span>
                  </a>
                )
              })
            }
          </Nav>
      </Navbar>
    );
  }
}

BlogSubMenu.need = [() => { return fetchCategories(); }];

function mapStateToProps(state) {
  return {
    userName: getUserName(state),
    fullName: getFullName(state),
    categories: getCategories(state),
    topics: getTopics(state),
    id: getId(state),
    visibleBlog: getVisibleBlog(state),
    expanded: getExpanded(state),
  };
}
BlogSubMenu.propTypes = {
  dispatch: PropTypes.func,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  visibleBlog: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
};
BlogSubMenu.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(BlogSubMenu);
