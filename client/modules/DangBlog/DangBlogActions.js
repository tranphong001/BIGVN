import callApi from '../../util/apiCaller';

export const ACTIONS = {
  SET_TOPICS: 'SET_TOPICS',
};

export function setTopic(topics) {
  return {
    type: ACTIONS.SET_TOPICS,
    topics
  };
}

export function fetchTopics() {
  return (dispatch) => {
    return callApi('topics', 'get', '' ).then(res => {
      dispatch(setTopic(res.topics));
    });
  };
}
export function uploadImage(base64image) {
  return () => {
    const file = {
      base64image,
    };
    return callApi('blog/photo', 'post', '', { file }).then((res) => {
      return res;
    });
  };
}

export function postBlog(blog) {
  return () => {
    return callApi('blog', 'post', '', {blog}).then(res => {
      return res;
    });
  };
}
