// Import Actions
import { ACTIONS } from './HomeActions';

// Initial State
const initialState = {
  newsList: [],
  newsVipList: [],
  news: {},
  related: [],
  relatedKeyword1: [],
  relatedKeyword2: [],
  blog: {},
  loading: false,

  maxPage: 1,
  currentPage: 1,
  metaKeyword: '',
  metaDescription: '',
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_META_KEYWORD:
      return { ...state, metaKeyword: action.metaKeyword };
    case ACTIONS.SET_META_DESCRIPTION:
      return { ...state, metaDescription: action.metaDescription };
    case ACTIONS.ADD_RELATED_KEYWORD_1:
      return { ...state, relatedKeyword1: action.news };
    case ACTIONS.ADD_RELATED_KEYWORD_2:
      return { ...state, relatedKeyword1: action.news };
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
export const getRelatedKeyword1 = state => state.home.relatedKeyword1;
export const getRelatedKeyword2 = state => state.home.relatedKeyword2;
export const getMetaKeyword = state => state.home.metaKeyword;
export const getMetaDescription = state => state.home.metaDescription;

export default HomeReducer;
