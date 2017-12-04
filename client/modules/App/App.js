import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './App.css';
import grid from '../../grid.css';
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';
import BlogSubMenu from './components/Menu/BlogSubMenu';
import DrawerMenu from './components/DrawerMenu/DrawerMenu';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import localStorage from 'localStorage';
injectTapEventPlugin();

import { closeNotify, fetchCities, reloginUser, fetchBanner, fetchVipAll, fetchTopics, fetchSetting } from './AppActions';
import { getIsNotify, getMessage, getServerTime, getId, getUserName } from './AppReducer';
import { Modal } from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
    this.muiThemeSetting = getMuiTheme(null, { userAgent: 'all' });
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }
  componentWillMount() {
    if(localStorage.getItem('token') != null) {
      const user = {
        token: localStorage.getItem('token')
      };
      this.props.dispatch(reloginUser(user));
    }
    this.props.dispatch(fetchTopics());
    this.props.dispatch(fetchCities());
    this.props.dispatch(fetchBanner());
    this.props.dispatch(fetchVipAll());
    this.props.dispatch(fetchSetting());
  }
  onHide = () => {
    this.props.dispatch(closeNotify());
  };
  onFreeApp = () => {
    if (this.props.id !== '') {
      this.context.router.push('/news');
    } else {
      this.context.router.push('/signin');
    }
  };
  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiThemeSetting}>
        <div>
          {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
          <div style={{ backgroundColor: '#FFF' }}>
            <Helmet
              title="BIG.VN"
              titleTemplate=""
              meta={[
                { charset: 'utf-8' },
                {
                  'http-equiv': 'X-UA-Compatible',
                  content: 'IE=edge',
                },
                {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
                },
                {
                  name: 'keyword',
                  content: `${this.props.userName}`,
                },
                {
                  name: 'description',
                  content: `${this.props.userName}`,
                },
              ]}
            />
            <Header />
            <Menu />
            <div className={grid.headerFree480}>
              <FlatButton
                icon={<FontIcon className="fa fa-pencil-square-o fa-5" style={{ fontSize: '16px' }}/>}
                onClick={this.onFreeApp}
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
            </div>
            <hr className={grid.hrHeader} />
            <BlogSubMenu />
            <DrawerMenu />
            <div className={`row ${grid.content}`} >
              {this.props.children}
            </div>
            <Footer className="row" />
            <Modal show={this.props.isNotify} onHide={this.onHide}>
              <Modal.Header closeButton>
                <Modal.Title>Thông báo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: this.props.message }} />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  serverTime: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    id: getId(store),
    isNotify: getIsNotify(store),
    userName: getUserName(store),
    message: getMessage(store),
    serverTime: getServerTime(store),
  };
}
App.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(App);
