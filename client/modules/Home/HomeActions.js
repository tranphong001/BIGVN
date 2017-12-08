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
  ADD_RELATED_KEYWORD_1: 'ADD_RELATED_KEYWORD_1',
  ADD_RELATED_KEYWORD_2: 'ADD_RELATED_KEYWORD_2',
  SET_META_KEYWORD: 'SET_META_KEYWORD',
  SET_META_DESCRIPTION: 'SET_META_DESCRIPTION',
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
export function addRelatedKeyword1(news) {
  return {
    type: ACTIONS.ADD_RELATED_KEYWORD_1,
    news,
  };
}
export function addRelatedKeyword2(news) {
  return {
    type: ACTIONS.ADD_RELATED_KEYWORD_2,
    news,
  };
}
export function setRelated(news) {
  return {
    type: ACTIONS.SET_RELATED,
    news,
  };
}
export function setMetaKeyword(metaKeyword) {
  return {
    type: ACTIONS.SET_META_KEYWORD,
    metaKeyword,
  };
}
export function setMetaDescription(metaDescription) {
  return {
    type: ACTIONS.SET_META_DESCRIPTION,
    metaDescription,
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
export function fetchNews(alias, url) {
  return (dispatch) => {
    return callApi(`news/get/${alias}${url}`, 'get', '').then(res => {
      if (res.mode === 'list') {
        dispatch(setMaxPage(res.maxPage));
        dispatch(addNewsList(res.news));
        if (res.type === 'news') {
          dispatch(addNewsVipList(res.vipCategory));
        }
      }
      if (res.mode === 'detail') {
        dispatch(setMaxPage(res.maxPage));
        dispatch(addNews(res.news));
        dispatch(setMetaKeyword(res.news.metaKeyword));
        dispatch(setMetaDescription(res.news.metaDescription));
        if (res.type === 'blog') {
          dispatch(addRelatedKeyword1(res.related1));
          dispatch(addRelatedKeyword2(res.related2));
        }
        if (res.mode === 'news') {
          dispatch(setRelated(res.related));
        }
      }
      return res;
    });
  };
}
export function fetchTag(alias, url) {
  return (dispatch) => {
    return callApi(`tag/${alias}${url}`, 'get', '').then(res => {
      if (res.mode === 'list') {
        dispatch(setMaxPage(res.maxPage));
        dispatch(addNewsList(res.news));
      }
      // if (res.mode === 'detail') {
      //   dispatch(setMaxPage(res.maxPage));
      //   dispatch(addNews(res.news));
      //   dispatch(setMetaKeyword(res.news.metaKeyword));
      //   dispatch(setMetaDescription(res.news.metaDescription));
      //   if (res.type === 'blog') {
      //     dispatch(addRelatedKeyword1(res.related1));
      //     dispatch(addRelatedKeyword2(res.related2));
      //   }
      //   if (res.mode === 'news') {
      //     dispatch(setRelated(res.related));
      //   }
      // }
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
  };
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
      dispatch(addNewsVipList(res.news));
    });
  };
}
