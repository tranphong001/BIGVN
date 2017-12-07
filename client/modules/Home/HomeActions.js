import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';

export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  ADD_NEWS_LIST: 'ADD_NEWS_LIST',
  SET_MAX_PAGE: 'SET_MAX_PAGE',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  ADD_NEWS_VIP_LIST: 'ADD_NEWS_VIP_LIST',
  ADD_NEWS: 'ADD_NEWS',
  ADD_BLOG_LIST: 'ADD_BLOG_LIST',
  ADD_BLOG: 'ADD_BLOG',
  SET_RELATED: 'SET_RELATED',
};

export function setMaxPage(maxPage) {
  return {
    type: ACTIONS.SET_MAX_PAGE,
    maxPage,
  };
}
export function setCurrentPage(currentPage) {
  return {
    type: ACTIONS.SET_CURRENT_PAGE,
    currentPage,
  };
}

export function setLoading() {
  return {
    type: ACTIONS.SET_LOADING,
  };
}
export function addNewsList(news) {
  return {
    type: ACTIONS.ADD_NEWS_LIST,
    news,
  };
}
export function addNewsVipList(news) {
  return {
    type: ACTIONS.ADD_NEWS_VIP_LIST,
    news,
  };
}
export function addNews(news) {
  return {
    type: ACTIONS.ADD_NEWS,
    news,
  };
}
export function fetchNews(alias, url) {
  return (dispatch) => {
    return callApi(`news/get/${alias}${url}`, 'get', '').then(res => {
      if (res.type === 'list') {
        dispatch(setMaxPage(res.maxPage));
        dispatch(addNewsList(res.news));
      }
      if (res.type === 'detail') {
        dispatch(setMaxPage(res.maxPage));
        dispatch(addNews(res.news));
      }
      return res;
    });
  };
}

export function searchNews(url) {
  return (dispatch) => {
    return callApi(`search/news${url}`, 'get', '').then(res => {
      dispatch(addNewsVipList([]));
      dispatch(addNewsList(res.news));
      dispatch(setMaxPage(res.count));
      dispatch(setCurrentPage(1));
    });
  }
}

export function searchNewsByCity(url) {
  return (dispatch) => {
    return callApi(`searchbycity/${url}`, 'get', '').then(res => {
      dispatch(addNewsList(res.news));
      dispatch(setMaxPage(res.count));
      dispatch(setCurrentPage(1));
    });
  }
}

export function fetchNewsByCategoryVip(category) {
  return (dispatch) => {
    return callApi(`news/vip/category/${category}`, 'get', '').then(res => {
      dispatch(addNewsVipList(res.news))
    });
  };
}

export function setRelated(news) {
  return {
    type: ACTIONS.SET_RELATED,
    news,
  };
}
export function fetchRelatedNews(alias) {
  return (dispatch) => {
    return callApi(`news/related/${alias}`, 'get', '').then(res => {
      dispatch(setRelated(res.news));
      return res;
    });
  }
}

