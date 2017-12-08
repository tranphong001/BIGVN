/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Home/pages/Home');
  require('./modules/Multiple/pages/Multiple');
  require('./modules/DangKy/DangKyPages');
  require('./modules/DangNhap/DangNhapPages');
  require('./modules/DangBlog/DangBlogPages');
  require('./modules/DangTin/DangTinPages');
  require('./modules/ManageNews/pages/ManageNews');
  require('./modules/ManageBlog/pages/ManageBlog');
  require('./modules/SharedComponents/Regulation');
  require('./modules/SharedComponents/Introduction');
  require('./modules/SharedComponents/Security');
  require('./modules/SharedComponents/Contact');
  require('./modules/SharedComponents/Policy');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/Home').default);
        });
      }}
    />
    <Route
      path="tag/:alias"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/Home').default);
        });
      }}
    />
    <Route
      path="regulation"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/SharedComponents/Regulation').default);
        });
      }}
    />
    <Route
      path="introduction"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/SharedComponents/Introduction').default);
        });
      }}
    />
    <Route
      path="policy"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/SharedComponents/Policy').default);
        });
      }}
    />
    <Route
      path="contact"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/SharedComponents/Contact').default);
        });
      }}
    />
    <Route
      path="security"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/SharedComponents/Security').default);
        });
      }}
    />
    <Route
      path="manageblogs"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/ManageBlog/pages/ManageBlog').default);
        });
      }}
    />
    <Route
      path="managenews"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/ManageNews/pages/ManageNews').default);
        });
      }}
    />
    <Route
      path="blog"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/DangBlog/DangBlogPages').default);
        });
      }}
    />
    <Route
      path="news"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/DangTin/DangTinPages').default);
        });
      }}
    />
    <Route
      path="signin"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/DangNhap/DangNhapPages').default);
        });
      }}
    />
    <Route
      path="signup"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/DangKy/DangKyPages').default);
        });
      }}
    />
    <Route
      path=":alias"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Home/pages/Home').default);
        });
      }}
    />
  </Route>
);
