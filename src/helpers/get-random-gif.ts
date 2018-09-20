import { promisified as p } from 'phin';

const TOKEN = process.env.GIPHY_APIKEY;
const RATING = 'pg';

interface IGiphyResponse {
  body: {
    data: {
      id: string;
    }
  }
}

export default (tag: string): Promise<string> => {
  const params = {
    url: `http://api.giphy.com/v1/gifs/random?rating=${RATING}&api_key=${TOKEN}&tag=${tag}`,
    parse: 'json'
  };

  return p(params).then((res: IGiphyResponse) => `https://i.giphy.com/media/${res.body.data.id}/giphy.gif`);
}
