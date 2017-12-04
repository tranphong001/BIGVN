import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, MenuItem, Glyphicon, Image, FormGroup, InputGroup, FormControl, Button, NavDropdown, DropdownButton } from 'react-bootstrap';
import MenuItem2 from 'material-ui/MenuItem';
import {logout, setPageHeader, setMenuHeader, setVisibleBlog, setExpanded, setIsTyping, setSearchCity } from '../../AppActions';
import { getUserName, getNewser, getBlogger, getCategories, getExpanded } from '../../AppReducer';
import styles from '../../../../main.css';
import Drawer from 'material-ui/Drawer';

class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrop: false,
    };
  }
  setString = (title) => {
    this.props.dispatch(setPageHeader(title.toUpperCase()));
    this.props.dispatch(setMenuHeader(title));
  };
  handleSelect = (eventKey) => {
    window.scrollTo(0, 0);
    if (eventKey !== undefined) {
      this.setState({ selected: eventKey });
      this.props.dispatch(setExpanded(false));
      this.props.dispatch(setIsTyping(false));
      this.props.dispatch(setSearchCity(''));
      if (eventKey === 'blogs') {
        this.props.dispatch(setPageHeader('BÀI VIẾT MỚI NHẤT'));
        this.props.dispatch(setMenuHeader('BÀI VIẾT MỚI NHẤT'));
        this.props.dispatch(setVisibleBlog(true));
      } else {
        this.props.dispatch(setVisibleBlog(false));
      }
      if (eventKey === 'home') {
        this.context.router.push('/');
      } else {
        this.context.router.push(`/${eventKey}`);
      }
    }
  };
  sinInSignUp = (a) => {
    console.log(a);
    this.setState({openDrop: false});
    this.props.dispatch(setExpanded(false));
    this.context.router.push(`/${a}`);
  };
  logOut = () => {
    this.context.router.push('/');
    this.setState({openDrop: false});
    this.props.dispatch(setExpanded(false));
    this.props.dispatch(logout());
  };
  render() {
    return (
      <Drawer
        docked={false}
        open={this.props.expanded}
        onRequestChange={(open) => this.props.dispatch(setExpanded(false))}
      >
        <div className={styles.drawerFont} style={{ backgroundColor: 'rgb(4, 78, 125)' }}>
          <a
            onClick={() => this.handleSelect('home')}
            style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
          >
            <img src='/images/newLogo.png' style={{ height: '50px', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px' }} />
          </a>
        </div>
        {
          (this.props.userName === '') ? (
            <a
              onClick={() => this.sinInSignUp('signin')}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={styles.drawerFont} style={{ padding: '5px 0 5px 10px', borderBottom: '1px solid #CCC' }}>
                Đăng nhập
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName === '') ? (
            <a
              onClick={() => this.sinInSignUp('signup')}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={styles.drawerFont} style={{ padding: '5px 0 5px 10px', borderBottom: '1px solid #CCC' }}>
                Đăng ký
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '') ? (
            <a
              onClick={() => this.setState({openDrop: !this.state.openDrop})}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={styles.drawerFont} style={{ padding: '5px 0 5px 10px', borderBottom: '1px solid #CCC' }}>
                <span>
                {this.props.userName}
                </span>
                {
                  this.state.openDrop ? (
                    <Glyphicon style={{ float: 'right', paddingRight: '20px'}} glyph="chevron-up" />
                  ) : (
                    <Glyphicon style={{ float: 'right', paddingRight: '20px'}} glyph="chevron-down" />
                  )
                }
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '' && this.state.openDrop && this.props.newser) ? (
            <a
              onClick={() => { this.sinInSignUp('news'); }}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={`${styles.drawerFont}`} style={{ padding: '5px 0 5px 20px', borderBottom: '1px solid #CCC' }}>
                Đăng tin
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '' && this.state.openDrop && this.props.newser) ? (
            <a
              onClick={() => { this.sinInSignUp('managenews'); }}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={`${styles.drawerFont}`} style={{ padding: '5px 0 5px 20px', borderBottom: '1px solid #CCC' }}>
                Quản lý tin
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '' && this.state.openDrop && this.props.blogger) ? (
            <a
              onClick={() => { this.sinInSignUp('blog'); }}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={`${styles.drawerFont}`} style={{ padding: '5px 0 5px 20px', borderBottom: '1px solid #CCC' }}>
                Đăng bài viết
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '' && this.state.openDrop && this.props.blogger) ? (
            <a
              onClick={() => { this.sinInSignUp('manageblogs'); }}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={`${styles.drawerFont}`} style={{ padding: '5px 0 5px 20px', borderBottom: '1px solid #CCC' }}>
                Quản lý bài viết
              </div>
            </a>
          ) : ''
        }
        {
          (this.props.userName !== '' && this.state.openDrop ) ? (
            <a
              onClick={this.logOut}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={`${styles.drawerFont}`} style={{ padding: '5px 0 5px 20px', borderBottom: '1px solid #CCC' }}>
                Đăng xuất
              </div>
            </a>
          ) : ''
        }


        {
          this.props.categories.map((cate, index) => (
            <a
              key={`${index}Drawer`}
              onClick={() => {this.handleSelect(cate.alias);this.setString(cate.title);}}
              style={{ fontSize: '10pt', color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className={styles.drawerFont} style={{ padding: '5px 0 5px 10px', borderBottom: '1px solid #CCC' }}>
                {cate.title}
              </div>
            </a>
          ))
        }
        <div className={styles.drawerFont}  style={{ padding: '5px 0 5px 10px', borderBottom: '1px solid #cc' }}>
          <a onClick={() => this.handleSelect('blogs')} style={{fontSize: '10pt', color: '#FF6600', fontWeight: 'bold' }}>KINH NGHIỆM</a>
        </div>
      </Drawer>
    );
  }
}
function mapStateToProps(state) {
  return {
    expanded: getExpanded(state),
    categories: getCategories(state),
    userName: getUserName(state),
    blogger: getBlogger(state),
    newser: getNewser(state),
  };
}
DrawerMenu.propTypes = {
  dispatch: PropTypes.func,
  expanded: PropTypes.bool.isRequired,
  newser: PropTypes.bool.isRequired,
  blogger: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
};
DrawerMenu.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DrawerMenu);
