import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as client from './client.js';
import SummonerProfile from './profile.js';
import Winrates from './winrates.js';
import './summoner.css';
import './winrates.css';
import { Row, Col, Image } from 'react-bootstrap';

function Summoner() {
	const { server, summonerName } = useParams();
	const [summonerData, setSummonerData] = useState();
	const [fetchingData, setFetchingData] = useState(true);
	const matchCount = 20;

	const getWinrateDataByQueue = (queueType, winrateData) => {
		let queueData = undefined;
		if (queueType === 'solo') {
			queueData = winrateData.find(
				(data) => data.queueType === 'RANKED_SOLO_5x5'
			);
		} else if (queueType === 'flex') {
			queueData = winrateData.find(
				(data) => data.queueType === 'RANKED_FLEX_SR'
			);
		}
		const extractedWinrateData = queueData && {
			win: queueData.wins,
			loss: queueData.losses,
			tier: queueData.tier,
			rank: queueData.rank,
			leaguePoints: queueData.leaguePoints,
		};
		return extractedWinrateData;
	};
	useEffect(() => {
		const fetchData = async () => {
			setSummonerData(undefined);
			setFetchingData(true);
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
					const soloQueueData = getWinrateDataByQueue(
						'solo',
						winrateData
					);
					const flexQueueData = getWinrateDataByQueue(
						'flex',
						winrateData
					);
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
					name: response.summonerName,
					region: server,
					profileIconId: response.profileIconId,
				};
				await client.addRecentSearch(searchData);
			}
			setFetchingData(false);
		};
		fetchData();
	}, [server, summonerName]);
	return summonerData ? (
		<div className='summoner-data-margins'>
			<Row>
				<SummonerProfile summonerData={summonerData} />
			</Row>
			<Row className='queue-data-margin-top'>
				<Col xl={4} lg={4} md={12} sm={12} xs={12} className='mb-4'>
					<div className='d-flex flex-column'>
						<Winrates
							queueData={summonerData.soloQueueRank}
							queueName='Ranked Solo/Duo'
						/>
						<Winrates
							queueData={summonerData.flexQueueRank}
							queueName='Ranked Flex'
						/>
					</div>
				</Col>
				<Col xl={8} lg={8} md={12} sm={12} xs={12}>
					Test
				</Col>
			</Row>
		</div>
	) : fetchingData ? (
		<div className='no-data-align'>
			<Image
				src={require('../../images/hype-kitten.png')}
				alt='no data'
				className='no-data-img'
				loading='lazy'
			/>
			<h3 style={{ color: '#FFFFFF' }}>
				Fetching data for:
			</h3>
			<div className='no-data-summoner-name'>
				"{summonerName}"
			</div>
		</div>
	) : (
		<div className='no-data-align'>
			<Image
				src={require('../../images/sad-kitten.png')}
				alt='no data'
				className='no-data-img'
				loading='lazy'
			/>
			<h3 style={{ color: '#FFFFFF' }}>
				Sorry! We couldn't find summoner data for: 
			</h3>
			<div className='no-data-summoner-name'>
				"{summonerName}"
			</div>
		</div>
	);
}
export default Summoner;
