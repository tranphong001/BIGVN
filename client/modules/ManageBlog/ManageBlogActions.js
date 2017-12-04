import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';

export const ACTIONS = {
  ADD_USER_BLOGS: 'ADD_USER_BLOGS',
};

export function addUserBlogs(blogs) {
  return {
    type: ACTIONS.ADD_USER_BLOGS,
    blogs
  };
}
export function fetchUserBlogs(id) {
  return (dispatch) => {
    return callApi(`blogs/user/${id}`, 'get', '').then(res => {
      console.log(res);
      dispatch(addUserBlogs(res.blogs));
    });
  }
}
export function edit(news) {
  return () => {
    return callApi('news', 'put', '', { news }).then(res => {
      return res;
    });
  };
}
