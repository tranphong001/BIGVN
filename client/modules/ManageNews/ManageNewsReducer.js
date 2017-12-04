// Import Actions
import { ACTIONS } from './ManageNewsActions';

// Initial State
const initialState = {
  userNews: [],
};

const ManagerNewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ADD_USER_NEWS:
      return { ...state, userNews: action.news };
    default:
      return state;
  }
};

export const getUserNews = state => state.manageNews.userNews;

export default ManagerNewsReducer;
