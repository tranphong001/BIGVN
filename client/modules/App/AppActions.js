import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';
// Export Constants
export const ACTIONS = {
  ON_CLOSE_SIGN: 'ON_CLOSE_SIGN',
  SET_NOTIFY: 'SET_NOTIFY',
  CLOSE_NOTIFY: 'CLOSE_NOTIFY',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  ADD_CATEGORIES: 'ADD_CATEGORIES',
  ADD_CITIES: 'ADD_CITIES',
  ADD_DISTRICTS: 'ADD_DISTRICTS',
  ADD_WARDS: 'ADD_WARDS',
  ADD_BANNER: 'ADD_BANNER',
  ADD_VIP_CATEGORY: 'ADD_VIP_CATEGORY',
  ADD_VIP_ALL: 'ADD_VIP_ALL',
  ADD_TOPICS: 'ADD_TOPICS',
  ADD_BLOGS: 'ADD_BLOGS',
  ADD_SETTING: 'ADD_SETTING',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_CITY: 'SET_CITY',
  SET_STRING: 'SET_STRING',
  SET_CATEGORY_NAME: 'SET_CATEGORY_NAME',
  SET_VISIBLE_BLOG: 'SET_VISIBLE_BLOG',
  SET_EXPANDED: 'SET_EXPANDED',
  SET_PAGE_HEADER: 'SET_PAGE_HEADER',
  SET_MENU_HEADER: 'SET_MENU_HEADER',
  SET_IS_TYPING: 'SET_IS_TYPING',
};

import * as firebase from 'firebase';
firebase.initializeApp({
  apiKey: 'AIzaSyD-Wkjz6U8uU9fWULnXQDBhb9HWqhxiHys',
  authDomain: 'bigvndev.firebaseapp.com',
  databaseURL: 'https://bigvndev.firebaseio.com',
  projectId: 'bigvndev',
  storageBucket: 'bigvndev.appspot.com',
  messagingSenderId: '916415173300',
});
export function setMenuHeader(menuHeader) {
  return {
    type: ACTIONS.SET_MENU_HEADER,
    menuHeader
  };
}
export function setPageHeader(pageHeader) {
  return {
    type: ACTIONS.SET_PAGE_HEADER,
    pageHeader
  };
}
export function setExpanded(expanded) {
  return {
    type: ACTIONS.SET_EXPANDED,
    expanded
  };
}
export function setVisibleBlog(visibleBlog) {
  return {
    type: ACTIONS.SET_VISIBLE_BLOG,
    visibleBlog
  };
}
export function setSearchCategoryName(searchCategoryName) {
  return {
    type: ACTIONS.SET_CATEGORY_NAME,
    searchCategoryName
  };
}
export function setSearchCategory(searchCategory) {
  return {
    type: ACTIONS.SET_CATEGORY,
    searchCategory
  };
}
export function setIsTyping(isTyping) {
  return {
    type: ACTIONS.SET_IS_TYPING,
    isTyping
  };
}
export function typingSearchString(searchString) {
  return(dispatch) => {
    dispatch(setIsTyping(true));
    dispatch(setSearchString(searchString));
  }
}
export function setSearchString(searchString) {
  return {
    type: ACTIONS.SET_STRING,
    searchString
  };
}
export function setSearchCity(searchCity) {
  return {
    type: ACTIONS.SET_CITY,
    searchCity
  };
}
export function getCaptcha() {
  return () => {
    return callApi('user/getCaptcha', 'get', '').then(res => {
      return res;
    });
  };
}
export function createUser(user) {
  return (dispatch) => {
    return callApi('user', 'post', '', { user }).then(res => {
      dispatch(login(res.user));
      return res;
    });
  };
}
export function setNotify(message) {
  return {
    type: ACTIONS.SET_NOTIFY,
    message,
  };
}
export function closeNotify() {
  return {
    type: ACTIONS.CLOSE_NOTIFY,
  };
}
export function login(user) {
  return {
    type: ACTIONS.LOGIN,
    user,
  };
}
export function logout() {
  localStorage.removeItem('token');
  return {
    type: ACTIONS.LOGOUT,
  };
}

export function reloginUser(user) {
  return (dispatch) => {
    return callApi('user/relogin', 'post', '', { user }).then(res => {
      if (res.user !== 'none') {
        dispatch(login(res.user));
      } else {
        localStorage.setItem('token', res.user.token);
        return res;
      }
    });
  };
}
export function loginUser(user, remember) {
  return (dispatch) => {
    return callApi('user/login', 'post', '', { user }).then(res => {
      if (res.user !== 'unknown' && res.user !== 'missing') {
        if (remember) localStorage.setItem('token', res.user.token);
        dispatch(login(res.user));
      }
      return res;
    });
  };
}
export function facebookLogin(remember) {
  return (dispatch) => {
    const auth = firebase.auth();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
      display: 'popup',
    });
    return auth.signInWithPopup(provider).then((res) => {
      const user = {
        facebookId: res.additionalUserInfo.profile.id,
        email: res.additionalUserInfo.profile.email ? res.additionalUserInfo.profile.email : res.additionalUserInfo.profile.id,
        userName: res.additionalUserInfo.profile.email ? res.additionalUserInfo.profile.email : res.additionalUserInfo.profile.id,
        fullName: res.additionalUserInfo.profile.name,
      };
      return callApi('user/social/facebook', 'post', '', {user}).then(res => {
        if (res.user !== 'missing' && res.user !== 'error') {
          dispatch(login(res.user));
        } else {
          if (remember) localStorage.setItem('token', res1.user.token);
        }
        return res;
      });
    });
  };
}
export function googleLogin(remember) {
  return (dispatch) => {
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      display: 'popup',
    });
    return auth.signInWithPopup(provider).then((res) => {
      const user = {
        googleId: res.additionalUserInfo.profile.id,
        email: res.additionalUserInfo.profile.email,
        userName: res.additionalUserInfo.profile.email,
        fullName: res.additionalUserInfo.profile.name,
      };
      return callApi('user/social/google', 'post', '', { user }).then(res1 => {
        console.log(res1);
        if (res1.user !== 'missing' && res1.user !== 'error') {
          dispatch(login(res1.user));
        } else {
          if (remember) localStorage.setItem('token', res1.user.token);
          return res1;
        }
      });
    });
  };
}

export function addCategories(categories) {
  return {
    type: ACTIONS.ADD_CATEGORIES,
    categories,
  };
}
export function fetchCategories() {
  return (dispatch) => {
    return callApi('categories', 'get', '').then(res => {
      dispatch(addCategories(res.categories));
    });
  };
}

export function addCities(cities) {
  return {
    type: ACTIONS.ADD_CITIES,
    cities,
  };
}
export function fetchCities() {
  return (dispatch) => {
    return callApi('city', 'get', '').then(res => {
      dispatch(addCities(res.cities));
    });
  };
}

export function addDistricts(districts) {
  return {
    type: ACTIONS.ADD_DISTRICTS,
    districts,
  };
}
export function fetchDistricts(cityId) {
  return (dispatch) => {
    return callApi(`district/${cityId}`, 'get', '').then(res => {
      dispatch(addDistricts(res.districts));
    });
  };
}

export function addWards(wards) {
  return {
    type: ACTIONS.ADD_WARDS,
    wards,
  };
}
export function fetchWards(districtId) {
  return (dispatch) => {
    return callApi(`ward/${districtId}`, 'get', '').then(res => {
      dispatch(addWards(res.wards));
    });
  };
}

export function addBanners(banner) {
  return {
    type: ACTIONS.ADD_BANNER,
    banner,
  };
}
export function fetchBanner() {
  return (dispatch) => {
    return callApi('banners', 'get', '').then(res => {
      res.banners.map((banner) => {
        dispatch(addBanners(banner));
      });
    });
  };
}

export function addVipCategory(news) {
  return {
    type: ACTIONS.ADD_VIP_CATEGORY,
    news,
  };
}
export function fetchVipCategory(alias) {
  return (dispatch) => {
    return callApi(`news/vip/category/${alias}`, 'get', '').then(res => {
      dispatch(addVipCategory(res.news));
      return res;
    });
  };
}
export function addVipAll(news) {
  return {
    type: ACTIONS.ADD_VIP_ALL,
    news,
  };
}
export function fetchVipAll() {
  return (dispatch) => {
    return callApi('news/vip/all', 'get', '').then(res => {
      dispatch(addVipAll(res.news));
    });
  };
}

export function fetchNews() {
  return () => {
    return callApi('news', 'get', '').then(res => {
      return res;
    });
  };
}

export function addTopics(topics) {
  return {
    type: ACTIONS.ADD_TOPICS,
    topics,
  };
}
export function fetchTopics() {
  return (dispatch) => {
    return callApi('topics', 'get', '').then(res => {
      dispatch(addTopics(res.topics));
    });
  };
}

export function addSetting(setting) {
  return {
    type: ACTIONS.ADD_SETTING,
    setting,
  };
}
export function fetchSetting() {
  return (dispatch) => {
    return callApi('settings', 'get', '').then(res => {
      res.settings.map((setting) => {
        dispatch(addSetting(setting));
      });
    });
  };
}

export function fetchKeywords(alias) {
  return () => {
    return callApi(`keyword/${alias}`, 'get', '').then(res => {
      return res;
    });
  };
}

