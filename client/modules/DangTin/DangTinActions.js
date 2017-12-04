import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';

export const ACTIONS = {
};

export function postNews(news) {
  return () => {
    return callApi('news', 'post', '', { news }).then(res => {
      return res;
    });
  };
}

export function uploadImage(base64image) {
  return () => {
    const file = {
      base64image,
    };
    return callApi('news/photo', 'post', '', { file }).then((res) => {
      return res;
    });
  };
}
