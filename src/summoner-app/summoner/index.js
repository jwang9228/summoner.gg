import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as client from './client.js';
import SummonerProfile from './profile.js';
import Winrates from './winrates.js';
import './summoner.css';
import './winrates.css';
import { Container, Row } from 'react-bootstrap';

function Summoner() {
	const { server, summonerName } = useParams();
	const [summonerData, setSummonerData] = useState();
	const matchCount = 20;

	const getWinrateDataByQueue = (queueType, winrateData) => {
		let queueData = undefined;
		if (queueType === 'solo') {
			queueData = winrateData.find(data => data.queueType === 'RANKED_SOLO_5x5');
		} else if (queueType === 'flex') {
			queueData = winrateData.find(data => data.queueType === 'RANKED_FLEX_SR');
		}
		const extractedWinrateData = queueData && {
			'win': queueData.wins,
			'loss': queueData.losses,
			'tier': queueData.tier,
			'rank': queueData.rank,
			'leaguePoints': queueData.leaguePoints
		};
		return extractedWinrateData;
	};
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
					const winrateData = await client.getWinrateData(
						server,
						data.id
					);
					const soloQueueData = getWinrateDataByQueue('solo', winrateData);
					const flexQueueData = getWinrateDataByQueue('flex', winrateData);
					const newSummonerData = {
						summonerName: data.name,
						summonerLevel: data.summonerLevel,
						summonerId: data.id,
						profileIconId: data.profileIconId,
						puuid: data.puuid,
						server: server,
						matchIDs: matchIDs,
						soloQueueRank: soloQueueData,
						flexQueueRank: flexQueueData,
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
	return summonerData ? (
		<Container className='summoner-data-margins'>
			<Row>
				<SummonerProfile summonerData={summonerData} />
			</Row>
			<Row className='queue-data-margin-top'>
				<Winrates queueData={summonerData.soloQueueRank} queueName='Ranked Solo/Duo' />
				<Winrates queueData={summonerData.flexQueueRank} queueName='Ranked Flex' />
			</Row>
		</Container>
	) : (
		<div>
			<h3 style={{ color: '#FFFFFF' }}>No summoner data found!</h3>
		</div>
	);
}
export default Summoner;
