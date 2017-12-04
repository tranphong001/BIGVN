// Import Actions
import { ACTIONS } from './HomeActions';

// Initial State
const initialState = {
  newsList: [],
  newsVipList: [],
  news: {},
  related: [],
  blog: {},
  loading: false,

  maxPage: 1,
  currentPage: 1,
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case ACTIONS.SET_MAX_PAGE:
      return { ...state, maxPage: action.maxPage };
    case ACTIONS.SET_RELATED:
      return { ...state, related: action.news };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: true };

    case ACTIONS.ADD_NEWS_LIST:
      return { ...state, newsList: action.news, loading: false };

    case ACTIONS.ADD_NEWS_VIP_LIST:
      return { ...state, newsVipList: action.news, loading: false };

    case ACTIONS.ADD_NEWS:
      return { ...state, news: action.news, loading: false };

    case ACTIONS.ADD_BLOG:
      return { ...state, news: action.blog, loading: false };
    default:
      return state;
  }
};

export const getCurrentPage = state => state.home.currentPage;
export const getMaxPage = state => state.home.maxPage;
export const getRelated = state => state.home.related;
export const getNewsList = state => state.home.newsList;
export const getNewsVipList = state => state.home.newsVipList;
export const getNews = state => state.home.news;
export const getBlog = state => state.home.blog;
export const getLoading = state => state.home.loading;

export default HomeReducer;