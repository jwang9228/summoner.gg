import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as client from './client.js';
import SummonerProfile from './profile.js';
import './summoner.css';

function Summoner() {
	const { server, summonerName } = useParams();
	const [summonerData, setSummonerData] = useState();
	const matchCount = 20;
	useEffect(() => {
		const fetchData = async () => {
			// if there is already an existing entry for the summoner in the DB, use that data (might be outdated)
			let response = await client.findSummonerByServer(
				server,
				summonerName
			);
			// if no entry exists, fetch data from Riot API and create a new DB entry
			if (!response) {
				const data = await client.getSummonerData(server, summonerName);
				if (data) {
					const matchIDs = await client.getMatchesByPUUID(
						server,
						data.puuid,
						matchCount
					);
					const newSummonerData = {
						summonerName: data.name,
						summonerLevel: data.summonerLevel,
						profileIconId: data.profileIconId,
						puuid: data.puuid,
						server: server,
						matchIDs: matchIDs,
					};
					await client.createSummoner(newSummonerData);
					response = newSummonerData;
				}
			}
			if (response) {
				setSummonerData(response);
				const searchData = {
					'name': response.summonerName,
					'region': server,
					'profileIconId': response.profileIconId
				};
				await client.addRecentSearch(searchData);
			}
		};
		fetchData();
	}, [server, summonerName]);
	// TODO: try to break the parts into separate components here
	return summonerData ? (
		<SummonerProfile summonerData={summonerData} />
	) : (
		<div>
			<h3 style={{ color: '#FFFFFF' }}>No summoner data found!</h3>
		</div>
	);
}
export default Summoner;
