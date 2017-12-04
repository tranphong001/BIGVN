// Import Actions
import { ACTIONS } from './AppActions';

// Initial State
const initialState = {

  isNotify: false,
  message: '',

  id: '',
  userName: '',
  fullName: '',
  newser: false,
  blogger: false,
  token: '',

  categories: [],

  cities: [],
  districts: [],
  wards: [],
  banners: {},

  vipAll: [],
  vipCategory: [],

  topics: [],

  setting: {},

  searchCategory: '',
  searchCategoryName: 'Tất cả danh mục',
  searchString: '',
  searchCity: '',
  isTyping: false,

  serverTime: new Date().getTime(),

  visibleBlog: false,
  expanded: false,

  pageHeader: 'TIN TỨC MỚI NHẤT',
  menuHeader: 'TIN TỨC MỚI NHẤT',
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_MENU_HEADER:
      return { ...state, menuHeader: action.menuHeader };
    case ACTIONS.SET_PAGE_HEADER:
      return { ...state, pageHeader: action.pageHeader };
    case ACTIONS.SET_EXPANDED:
      return { ...state, expanded: action.expanded };
    case ACTIONS.SET_VISIBLE_BLOG:
      return { ...state, visibleBlog: action.visibleBlog };
    case ACTIONS.SET_CATEGORY_NAME:
      return { ...state, searchCategoryName: action.searchCategoryName };
    case ACTIONS.SET_CATEGORY:
      return { ...state, searchCategory: action.searchCategory };
    case ACTIONS.SET_STRING:
      return { ...state, searchString: action.searchString };
    case ACTIONS.SET_IS_TYPING:
      return { ...state, isTyping: action.isTyping };
    case ACTIONS.SET_CITY:
      return { ...state, searchCity: action.searchCity };
    case ACTIONS.ADD_TOPICS:
      return { ...state, topics: action.topics };
    case ACTIONS.ADD_VIP_CATEGORY:
      return { ...state, vipCategory: action.news };
    case ACTIONS.ADD_VIP_ALL:
      return { ...state, vipAll: action.news };
    case ACTIONS.ADD_BANNER:
      return {
        ...state,
        banners: {
          ...state.banners,
          [action.banner.name]: action.banner
        }
      };
    case ACTIONS.ADD_SETTING:
      return {
        ...state,
        setting: {
          ...state.setting,
          [action.setting.name]: action.setting
        }
      };
    case ACTIONS.ADD_CITIES:
      return { ...state, cities: action.cities };
    case ACTIONS.ADD_DISTRICTS:
      return { ...state, districts: action.districts };
    case ACTIONS.ADD_WARDS:
      return { ...state, wards: action.wards };
    case ACTIONS.ADD_CATEGORIES:
      return { ...state, categories: action.categories };
    case ACTIONS.SET_NOTIFY:
      return { ...state, isNotify: true, message: action.message };
    case ACTIONS.CLOSE_NOTIFY:
      return { ...state, isNotify: false, message: '' };
    case ACTIONS.LOGIN:
      return {
        ...state,
        id: action.user.id,
        fullName: action.user.fullName,
        userName: action.user.userName,
        blogger: action.user.blogger,
        newser: action.user.newser,
        token: action.user.token
      };
    case ACTIONS.LOGOUT: {
      return {...state, id: '', email: '', userName: '', token: ''};
    }
    default:
      return state;
  }
};

/* Selectors */

export const getExpanded = state => state.app.expanded;
export const getSearchString = state => state.app.searchString;
export const getSearchCity = state => state.app.searchCity;
export const getServerTime = state => state.app.serverTime;
export const getSearchCategory = state => state.app.searchCategory;
export const getSearchCategoryName = state => state.app.searchCategoryName;

export const getIsNotify = state => state.app.isNotify;
export const getMessage = state => state.app.message;

export const getId = state => state.app.id;
export const getEmail = state => state.app.email;
export const getUserName = state => state.app.userName;
export const getFullName = state => state.app.fullName;
export const getNewser = state => state.app.newser;
export const getBlogger = state => state.app.blogger;
export const getToken = state => state.app.token;

export const getCategories = state => state.app.categories;

export const getCities = state => state.app.cities;
export const getDistricts = state => state.app.districts;
export const getWards = state => state.app.wards;

export const getBanners = state => state.app.banners;
export const getVipAll = state => state.app.vipAll;
export const getVipCategory = state => state.app.vipCategory;

export const getTopics = state => state.app.topics;
export const getSettings = state => state.app.setting;

export const getVisibleBlog = state => state.app.visibleBlog;
export const getPageHeader = state => state.app.pageHeader;
export const getMenuHeader = state => state.app.menuHeader;
export const getIsTyping = state => state.app.isTyping;

// Export Reducer
export default AppReducer;
