// Import Actions
import { ACTIONS } from './DangBlogActions';

// Initial State
const initialState = {
  topics: [],
};

const DangBlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TOPICS:
      return { ...state, topics: action.topics };
    default:
      return state;
  }
};

export const getTopics = state => state.dangBlog.topics;

// Export Reducer
export default DangBlogReducer;
