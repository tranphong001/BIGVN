/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import dangTin from './modules/DangTin/DangTinReducer';
import dangBlog from './modules/DangBlog/DangBlogReducer';
import home from './modules/Home/HomeReducer';
import manageNews from './modules/ManageNews/ManageNewsReducer';
import manageBlog from './modules/ManageBlog/ManageBlogReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  dangTin,
  dangBlog,
  home,
  manageNews,
  manageBlog,
});
