// Import Actions
import { ACTIONS } from './ManageBlogActions';

// Initial State
const initialState = {
  userBlogs: [],
};

const ManagerBlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ADD_USER_BLOGS:
      return { ...state, userBlogs: action.blogs };
    default:
      return state;
  }
};

export const getUserBlogs = state => state.manageBlog.userBlogs;

export default ManagerBlogReducer;
