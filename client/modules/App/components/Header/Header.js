import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, MenuItem, Glyphicon, Image, Form, FormGroup, InputGroup, FormControl, Button, NavDropdown, DropdownButton } from 'react-bootstrap';
import styles from './Header.css';
import grid from '../../../../grid.css';
import MenuItem2 from 'material-ui/MenuItem';
import { logout, setSearchString, setSearchCategory, setSearchCategoryName, setPageHeader, setExpanded, setIsTyping } from '../../AppActions';
import { getSearchCity, getUserName, getId, getFullName, getCategories, getBlogger, getNewser, getSearchCategory, getSearchString, getSearchCategoryName, getExpanded } from '../../AppReducer';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'en',
      open: false,
      openUserMenu: false,
      dataSource: [],

      oldSearchCategory: '',
      oldSearchCity: '',
      oldSearchString: '--',

      selected1: true,
      selected2: false,

      openForm: false,
    };
    this.loaded = false;
    this.typing = false;
  }
  componentDidMount() {
    this.loaded = true;
  }
  componentWillReceiveProps(nextProps) {
    if (
      (
        nextProps.searchString !== this.state.oldSearchString ||
        nextProps.searchCity !== this.state.oldSearchCity ||
        nextProps.searchCategory !== this.state.searchCategory
      ) &&
      nextProps.params &&
      // this.typing &&
      this.loaded
    ) {
      // this.setState({ oldSearchString: nextProps.searchString, searchCategory: nextProps.searchCategory });
      // let str = '/?';
      // if (nextProps.searchCategory !== '') str += `searchCategory=${nextProps.searchCategory}`;
      // if (str.length > 2) str += '&';
      // if (nextProps.searchString !== '') str += `searchString=${nextProps.searchString}`;
      // if (str.indexOf('searchString') > -1) str += '&';
      // if (nextProps.searchCity !== '') str += `searchCity=${nextProps.searchCity}`;
      // if (str.length === 2) str = '';
      // this.context.router.push(str);
      // this.props.dispatch(searchNews(str));
    }
  }
  onClick = () => {
    this.context.router.push('/');
    this.props.dispatch(setSearchString(''));
  };
  onCreateNews = () => {
    this.context.router.push('/news');
  };
  onCreateBlog = () => {
    this.context.router.push('/blog');
  };
  handleUser = (selectedKey) => {
    switch (selectedKey) {
      case 'logOut': {
        this.context.router.push('/');
        this.props.dispatch(logout());
        break;
      }
      default: break;
    }
  };
  onFree = () => {
    if (this.props.id !== '') {
      this.context.router.push('/news');
    } else {
      this.context.router.push('/signin');
    }
  };
  onLogOut = () => {
    this.context.router.push('/');
    this.props.dispatch(logout());
  };
  onSignIn = () => {
    this.context.router.push('/signin');
  };
  onSignUp = () => {
    this.context.router.push('/signup');
  };
  onManageNews = () => {
    this.context.router.push('/managenews');
  };
  onManageBlog = () => {
    this.context.router.push('/manageblogs');
  };
  onToggle = (expanded) => {
    this.props.dispatch(setExpanded(expanded));
  };
  onSelected1 = () => {
    this.setState({ selected1: true, selected2: false });
  };
  onSelected2 = () => {
    this.setState({ selected1: false, selected2: true });
  };
  openForm = () => {
    this.setState({ openForm: !this.state.openForm });
  };
  render() {
    return (
      <Navbar
        className={`${grid.customNavbar} ${(this.state.openForm) ? (grid.customNavbarMoved) : ''}`}
        collapseOnSelect
        inverse
        onToggle={this.onToggle}
        expanded={false}
      >
        <Navbar.Header className={`${grid.customHeader}`}>
          <div className={`${grid.logoAndToggle}`}>
            <Navbar.Toggle className={grid.headerForm} style={{ marginRight: '0' }}/>
            <div
              onClick={this.onClick}
              style={{
                backgroundImage: 'url(/images/nextLogo.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100%',
                height: '35px',
                width: '100px',
                display: 'table-cell',
                marginTop: '8px',
                marginLeft: 'auto',
              }}
            />

            <Form className={`${grid.headerForm} ${(this.state.openForm) ? (styles.formWidthWhenOpen) : ''}`} style={{ marginLeft: 'auto' }}>
              <FormGroup>
                <InputGroup style={{ paddingTop: '3px' }}>
                  <DropdownButton
                    className={(this.state.openForm) ? (styles.openForm) : (styles.closeForm)}
                    componentClass={InputGroup.Button}
                    id="categoryDropDown"
                    title={this.props.searchCategoryName}
                    value={this.props.searchCategory}
                    style={{fontSize: '11pt', height: '32px', paddingTop: '6px', backgroundColor: 'white', backgroundImage: 'none' }}
                  >
                    <MenuItem
                      style={{ color: 'red' }}
                      onClick={() => {
                        this.props.dispatch(setSearchCategory(''));
                        this.props.dispatch(setSearchCategoryName('Tất cả danh mục'));
                        this.props.dispatch(setPageHeader('TIN TỨC MỚI NHẤT'));
                      }
                      }
                    >
                      Tất cả danh mục
                    </MenuItem>
                    {
                      this.props.categories.map((cate, index) => (
                        <MenuItem
                          key={index}
                          value={cate.alias}
                          onClick={() => {
                            this.props.dispatch(setSearchCategory(cate.alias));
                            this.props.dispatch(setSearchCategoryName(cate.title));
                            this.props.dispatch(setPageHeader(cate.title.toUpperCase()));
                          }
                          }
                          style={{fontSize: '11pt'}}
                        >
                          {cate.title}
                        </MenuItem>
                      ))
                    }
                  </DropdownButton>
                  <FormControl
                    type="text"
                    style={{
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderTop: '1px solid #ccc',
                      borderBottom: '1px solid #ccc',
                      fontSize: '11pt',
                      height: '32px',
                      display: (this.state.openForm) ? 'block' : 'none'
                    }}
                    value={this.props.searchString}
                    onBlur={() => {
                      this.setState({typing: false});
                      this.props.dispatch(setIsTyping(false));
                    }}
                    onFocus={() => {
                      this.props.dispatch(setIsTyping(true));
                    }}
                    onChange={(event) => {
                      this.props.dispatch(setSearchString(event.target.value));
                      this.typing = true;
                    }}
                  />
                  <InputGroup.Button style={{ height: '32px' }}>
                    <Button
                      onClick={this.openForm}
                      style={{
                        borderLeft: 'none',
                        paddingTop: '7px',
                        paddingBottom: '3px',
                        paddingRight: '12px',
                        float: 'right',
                        backgroundColor: 'white',
                        backgroundImage: 'none',
                      }}
                    >
                      <Glyphicon glyph="glyphicon glyphicon-search" style={{fontSize: '16px'}}/>
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </Form>
          </div>
        </Navbar.Header>
        <Navbar.Collapse >
          <Nav className={`${grid.centerizeNav} ${grid.customCollapse}`} style={{ paddingTop: '9px' }}>
            <div className={styles.customForm}>
              <Form>
                <FormGroup>
                  <InputGroup style={{ paddingTop: '3px' }}>
                    <DropdownButton
                      componentClass={InputGroup.Button}
                      id="categoryDropDown"
                      title={this.props.searchCategoryName}
                      value={this.props.searchCategory}
                      style={{fontSize: '11pt', height: '32px', paddingTop: '6px', backgroundColor: 'white', backgroundImage: 'none'}}
                    >
                      <MenuItem
                        style={{ color: 'red' }}
                        onClick={() => {
                          this.props.dispatch(setSearchCategory(''));
                          this.props.dispatch(setSearchCategoryName('Tất cả danh mục'));
                          this.props.dispatch(setPageHeader('TIN TỨC MỚI NHẤT'));
                        }
                        }
                      >
                        Tất cả danh mục
                      </MenuItem>
                      {
                        this.props.categories.map((cate, index) => (
                          <MenuItem
                            key={index}
                            value={cate.alias}
                            onClick={() => {
                              this.props.dispatch(setSearchCategory(cate.alias));
                              this.props.dispatch(setSearchCategoryName(cate.title));
                              this.props.dispatch(setPageHeader(cate.title.toUpperCase()));
                            }
                            }
                            style={{fontSize: '11pt'}}
                          >
                            {cate.title}
                          </MenuItem>
                        ))
                      }
                    </DropdownButton>
                    <FormControl
                      type="text"
                      style={{
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderTop: '1px solid #ccc',
                        borderBottom: '1px solid #ccc',
                        fontSize: '11pt',
                        height: '32px'
                      }}
                      value={this.props.searchString}
                      onBlur={() => {
                        this.setState({typing: false});
                        this.props.dispatch(setIsTyping(false));
                      }}
                      onFocus={() => {
                        this.props.dispatch(setIsTyping(true));
                      }}
                      onChange={(event) => {
                        this.props.dispatch(setSearchString(event.target.value));
                        this.typing = true;
                      }}
                    />
                    <InputGroup.Button style={{ height: '32px' }}>
                      <Button
                        style={{
                          borderLeft: 'none',
                          paddingTop: '7px',
                          paddingBottom: '3px',
                          paddingRight: '12px',
                          backgroundColor: 'white',
                          backgroundImage: 'none'
                        }}
                      >
                        <Glyphicon glyph="glyphicon glyphicon-search" style={{fontSize: '16px'}}/>
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </FormGroup>
              </Form>
            </div>
          </Nav>
          {
            (this.props.userName === '') ? (
              <Nav className={`${grid.centerizeNav} ${grid.customCollapse}`} style={{ float: 'right', marginTop: '10px' }}>
                <NavItem onSelect={this.onSignIn} className={styles.headerLogInButton}>
                  Đăng nhập
                </NavItem>
                <NavItem className={styles.verticalSpliter}>
                </NavItem>
                <NavItem onSelect={this.onSignUp} className={styles.headerLogOutButton}>
                  Đăng ký
                </NavItem>
                <NavItem className={styles.headerFreeButton}>
                  <FlatButton
                    icon={<FontIcon className="fa fa-pencil-square-o fa-5" style={{ fontSize: '16px' }}/>}
                    onClick={this.onFree}
                    label="ĐĂNG TIN MIỄN PHÍ"
                    labelStyle={{
                      fontSize: '13px'
                    }}
                    style={{
                      float: 'right',
                      font: '13px Arial, Arial',
                      textAlign: 'center',
                      backgroundColor: '#FF6600',
                      border: 0,
                      color: '#FFF',
                      padding: '0',
                      position: 'relative',
                      height: '30px',
                      width: '180px',
                      paddingRight: '0'
                    }}
                  />
                </NavItem>
              </Nav>
              ) : (
                <Nav className={`${styles.headerAfterLogIn} ${grid.customCollapse} ${grid.centerizeNav}`} onSelect={this.handleUser} style={{ float: 'right' }}>
                  <NavDropdown
                    pullRight
                    componentClass={InputGroup.Button}
                    id="newsDropDown"
                    title={this.props.userName}
                  >
                    {
                      (this.props.newser) ? (
                        <MenuItem onClick={this.onCreateNews}>
                          <Glyphicon glyph="glyphicon glyphicon-file" />
                          <span>Đăng tin rao vặt</span>
                        </MenuItem>
                      ) : ''
                    }
                    {
                      (this.props.newser) ? (
                        <MenuItem onClick={this.onManageNews}>
                          <Glyphicon glyph="glyphicon glyphicon-duplicate" />
                          <span>Quản lý tin</span>
                        </MenuItem>
                      ) : ''
                    }
                    {
                      (this.props.newser && this.props.blogger) ? (
                        <Divider />
                      ) : ''
                    }
                    {
                      (this.props.blogger) ? (
                        <MenuItem onClick={this.onCreateBlog}>
                          <Glyphicon glyph="glyphicon glyphicon-inbox" />
                          <span>Đăng blog mới</span>
                        </MenuItem>
                      ) : ''
                    }
                    {
                      (this.props.blogger) ? (
                        <MenuItem onClick={this.onManageBlog}>
                          <Glyphicon glyph="glyphicon glyphicon-list"/>
                          <span>Quản lý blog</span>
                        </MenuItem>
                      ) : ''
                    }
                    <Divider />
                    <MenuItem onClick={this.onLogOut}>
                      <Glyphicon glyph="glyphicon glyphicon-log-out"/>
                      <span>Đăng xuất</span>
                    </MenuItem>
                  </NavDropdown>

                  <NavItem className={styles.headerFree2Button}>
                    <FlatButton
                      icon={<FontIcon className="fa fa-pencil-square-o fa-5" style={{ fontSize: '16px' }}/>}
                      onClick={this.onFree}
                      label="ĐĂNG TIN MIỄN PHÍ"
                      labelStyle={{
                        fontSize: '13px'
                      }}
                      style={{
                        float: 'right',
                        font: '13px Arial, Arial',
                        textAlign: 'center',
                        backgroundColor: '#FF6600',
                        border: 0,
                        color: '#FFF',
                        padding: '0',
                        position: 'relative',
                        height: '30px',
                        width: '180px',
                        paddingRight: '0'
                      }}
                    />
                  </NavItem>
                </Nav>
              )
          }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    userName: getUserName(state),
    blogger: getBlogger(state),
    newser: getNewser(state),
    fullName: getFullName(state),
    categories: getCategories(state),
    id: getId(state),
    searchCategory: getSearchCategory(state),
    searchCategoryName: getSearchCategoryName(state),
    searchString: getSearchString(state),
    searchCity: getSearchCity(state),
    expanded: getExpanded(state),
  };
}
Header.propTypes = {
  dispatch: PropTypes.func,
  blogger: PropTypes.bool.isRequired,
  newser: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  searchCategory: PropTypes.string.isRequired,
  searchCategoryName: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
};
Header.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Header);
