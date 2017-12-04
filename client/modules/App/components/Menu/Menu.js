import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './Menu.css';
import grid from '../../../../grid.css';
import { Navbar, Nav, NavItem, Button, Glyphicon, NavDropdown, MenuItem } from 'react-bootstrap';
import {
  fetchCategories, setVisibleBlog, setExpanded, setPageHeader, setMenuHeader,
  setIsTyping, setSearchCity
} from '../../AppActions';
import { getUserName, getId, getFullName, getCategories, getTopics, getVisibleBlog, getExpanded, getMenuHeader } from '../../AppReducer';
import main from '../../../../main.css';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'home',
      selectedBlog: 'blogs',
    };
  }
  componentDidMount() {
    this.props.dispatch(fetchCategories());
  }
  handleSelect = (eventKey) => {
    if (eventKey !== undefined) {
      this.props.dispatch(setPageHeader(eventKey.title.toUpperCase()));
      this.props.dispatch(setMenuHeader(eventKey.title));
      this.props.dispatch(setVisibleBlog(eventKey.alias === 'blogs'));
      this.props.dispatch(setSearchCity(''));
      this.props.dispatch(setIsTyping(false));
      this.props.dispatch(setExpanded(false));
      if (eventKey.alias === 'home') {
        this.context.router.push('/');
      } else {
        this.context.router.push(`/${eventKey.alias}`);
      }
    }
  };
  render() {
    return (
      <Navbar
        collapseOnSelect
        className={grid.navbar}
        onSelect={this.handleSelect}
        defaultExpanded={false}
        onToggle={() => {
        }}
      >
        <Navbar.Collapse style={{ paddingLeft: '0', paddingRight: '0'}}>
          <Nav className={styles.headerNav} style={{ width: '100%' }}>
            <NavItem
              className={`${(this.props.menuHeader === 'TIN TỨC MỚI NHẤT') ? (styles.active) : ''}`}
              eventKey={{alias:'home', title:'TIN TỨC MỚI NHẤT'}}
            >
              <span style={{ marginLeft: '0', borderRight: 'none' }}>
                <i className="fa fa-home" aria-hidden="true" style={{fontSize: '24px', marginTop: '-7px' }}/>
              </span>
            </NavItem>
            {
              this.props.categories.map((cate, index) => {
                return (
                  <NavItem
                    className={`
                      ${(this.props.menuHeader === cate.title) ? (styles.active) : ''}
                    `}
                    key={index}
                    eventKey={cate}
                  >
                    <span>
                      <span>{cate.title}</span>
                    </span>
                    {
                      (this.props.categories.length - 1 !== index) ?
                        (
                          <div
                            className={styles.verticalSpliter}
                          />
                        ) : ''
                    }
                  </NavItem>
                )
              })
            }
            <NavItem
              className={`${(this.props.menuHeader === 'blogs') ? (styles.active) : ''} ${styles.noBorderRight} ${styles.customBlogButton}`}
              style={{ float: 'right' }}
              eventKey={{alias:'blogs', title: 'BÀI VIẾT MỚI NHẤT'}}
            >
              <span style={{ paddingRight: '0' }}>
                <span>KINH NGHIỆM</span>
              </span>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Menu.need = [() => { return fetchCategories(); }];

function mapStateToProps(state) {
  return {
    userName: getUserName(state),
    fullName: getFullName(state),
    categories: getCategories(state),
    topics: getTopics(state),
    id: getId(state),
    visibleBlog: getVisibleBlog(state),
    expanded: getExpanded(state),
    menuHeader: getMenuHeader(state),
  };
}
Menu.propTypes = {
  dispatch: PropTypes.func,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  visibleBlog: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  menuHeader: PropTypes.string.isRequired,
};
Menu.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Menu);
