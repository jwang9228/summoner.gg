import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const findSummonerByServer = async (server, summonerName) => {
	try {
		const response = await axios.get(
			`${SERVER_URL}/summoners/${server}/${summonerName}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};
export const getMatchesByPUUID = async (server, puuid, matchCount) => {
	try {
		const response = await axios.get(
            `${SERVER_URL}/summoner/matches/${server}/${puuid}/${matchCount}`
        );
		return response.data;
	} catch (error) {
		return [];
	}
};
export const getSummonerData = async (server, summonerName) => {
	try {
		const response = await axios.get(
			`${SERVER_URL}/summoner/${server}/${summonerName}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};
export const createSummoner = async (summonerData) => {
	try {
		const response = await axios.post(
			`${SERVER_URL}/summoners`,
			summonerData
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};
