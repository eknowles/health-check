import { promisified as p } from 'phin';
import * as C from '../constants';

const TOKEN = process.env.GIPHY_APIKEY;
const RATING = 'pg';

interface IGiphyResponse {
  body: {
    data: {
      id: string;
    }
  }
}

const tagMap = {
  [C.CHECK_CONCLUSION.SUCCESS]: 'party',
  [C.CHECK_CONCLUSION.FAILURE]: 'cry',
  [C.CHECK_CONCLUSION.NEUTRAL]: 'meh',
  [C.CHECK_CONCLUSION.CANCELLED]: 'sad',
  [C.CHECK_CONCLUSION.TIMED_OUT]: 'bored',
  [C.CHECK_CONCLUSION.ACTION_REQUIRED]: 'action',
  [C.CHECK_CONCLUSION.COMPLETE]: 'done',
};

export default (conclusion: string): Promise<string> => {
  const params = {
    url: `http://api.giphy.com/v1/gifs/random?rating=${RATING}&api_key=${TOKEN}&tag=${tagMap[conclusion] || 'nice'}`,
    parse: 'json'
  };

  return p(params).then((res: IGiphyResponse) => `https://i.giphy.com/media/${res.body.data.id}/giphy.gif`);
}
