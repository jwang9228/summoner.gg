import axios from 'axios';

const request = axios.create({
	withCredentials: true,
});
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const findSummonerByServer = async (server, summonerName) => {
	try {
		const response = await request.get(
			`${SERVER_URL}/summoners/${server}/${summonerName}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const getMatchesByPUUID = async (server, puuid, matchCount) => {
	try {
		const response = await request.get(
			`${SERVER_URL}/summoner/matches/${server}/${puuid}/${matchCount}`
		);
		return response.data;
	} catch (error) {
		return [];
	}
};

export const getMatchData = async (server, matchID) => {
	try {
		const response = await request.get(
			`${SERVER_URL}/summoner/matches/${server}/${matchID}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const getSummonerData = async (server, summonerName) => {
	try {
		const [name, tagline] = summonerName.split('-');
		const response = await request.get(
			`${SERVER_URL}/summoner/${server}/${name}-${tagline}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const createSummoner = async (summonerData) => {
	try {
		const response = await request.post(
			`${SERVER_URL}/summoners`,
			summonerData
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const updateSummoner = async (updatedSummonerData) => {
	try {
		const response = await request.put(
			`${SERVER_URL}/summoners`,
			updatedSummonerData
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const getRecentSearches = async () => {
	try {
		const response = await request.get(
			`${SERVER_URL}/summoner/recentSearches`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const addRecentSearch = async (searchData) => {
	try {
		const response = await request.post(
			`${SERVER_URL}/summoner/recentSearches`,
			searchData
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};

export const getWinrateData = async (region, summonerId) => {
	try {
		const response = await request.get(
			`${SERVER_URL}/summoner/winrates/${region}/${summonerId}`
		);
		return response.data;
	} catch (error) {
		return undefined;
	}
};