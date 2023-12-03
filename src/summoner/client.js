import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getSummonerData = async (server, summonerName) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/summoner/${server}/${summonerName}`
    );
    return {
      data: {
        ...response.data,
        status: response.status,
      },
    };
  } catch (error) {
    return undefined;
  }
};
