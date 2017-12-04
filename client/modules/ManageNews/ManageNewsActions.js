import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';

export const ACTIONS = {
  ADD_USER_NEWS: 'ADD_USER_NEWS',
};

export function addUserNews(news) {
  return {
    type: ACTIONS.ADD_USER_NEWS,
    news
  };
}
export function fetchUserNews(id) {
  return (dispatch) => {
    return callApi(`news/${id}`, 'get', '').then(res => {
      dispatch(addUserNews(res.news));
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
