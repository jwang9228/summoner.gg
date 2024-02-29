import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import SummonerProfile from './profile/profile.js';
import Winrates from './winrates/winrates.js';
import RenderMatch from './match/match.js';
import * as client from './client.js';
import './summoner.css';
import './winrates/winrates.css';

function Summoner() {
	const { server, summonerName } = useParams();
	const [gameName, tagLine] = summonerName.split('-');
	const [summonerData, setSummonerData] = useState();
	const [fetchingData, setFetchingData] = useState(false);
	const [matchesData, setMatchesData] = useState([]);
	const [usersWhoFavorited, setUsersWhoFavorited] = useState([]);
	const matchCount = 20;

	const getWinrateDataByQueue = (queueType, winrateData) => {
		const queueTypeMapping = {
			'solo': 'RANKED_SOLO_5x5',
			'flex': 'RANKED_FLEX_SR'
		};

		const queueData = winrateData.find(data => data.queueType === queueTypeMapping[queueType]);

		return queueData && {
			win: queueData.wins,
			loss: queueData.losses,
			tier: queueData.tier,
			rank: queueData.rank,
			leaguePoints: queueData.leaguePoints,
		};
	};

	const getSummonerData = async () => {
		const data = await client.getSummonerData(server, summonerName);
		if (data) {
			const matchIDs = await client.getMatchesByPUUID(server, data.puuid, matchCount);
			const winrateData = await client.getWinrateData(server, data.id);
			const soloQueueData = getWinrateDataByQueue('solo', winrateData);
			const flexQueueData = getWinrateDataByQueue('flex', winrateData);
			return {
				summonerName: data.gameName,
				tagLine: data.tagLine,
				summonerLevel: data.summonerLevel,
				summonerId: data.id,
				profileIconId: data.profileIconId,
				puuid: data.puuid,
				server: server,
				matchIDs: matchIDs,
				soloQueueRank: soloQueueData,
				flexQueueRank: flexQueueData,
			}
		};
		return undefined;
	}

	const processMatchesData = async (matchIDs) => {
		const matchesData = [];
		for (const matchID of matchIDs) {
			const match = await client.getMatchData(server, matchID);
			matchesData.push(match);
		}
		setMatchesData(matchesData);
	}

	const processSummonerData = async (summonerData) => {
		await processMatchesData(summonerData.matchIDs);
		setSummonerData(summonerData);
	}

	const updateSummoner = async () => {
		setSummonerData(undefined);
		setFetchingData(true);
		const updatedSummonerData = await getSummonerData();
		await client.updateSummoner(updatedSummonerData);
		await processSummonerData(updatedSummonerData);
		setFetchingData(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			setSummonerData(undefined);
			setFetchingData(true);
			let response = await client.findSummonerByServer(server, gameName);
			if (!response) {
				const newSummonerData = await getSummonerData();
				if (newSummonerData) {
					await client.createSummoner(newSummonerData);
					response = newSummonerData;
				}
			}
			if (response) {
				const searchData = {
					name: response.summonerName,
					region: server,
					profileIconId: response.profileIconId,
				};
				await client.addRecentSearch(searchData);
				await processSummonerData(response);
			}
			setFetchingData(false);
		};
		fetchData();
	}, [server, summonerName]);

	return (
		summonerData ? (
			<div className='summoner-data-margins fade-in'>
				<Row>
					<SummonerProfile
						summonerData={summonerData}
						updateSummoner={updateSummoner}
						setUsersWhoFavorited={setUsersWhoFavorited}
					/>
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
						<div className='m-auto mt-2'>
							{matchesData && matchesData.map((matchData) => {
								return matchData && RenderMatch(
									matchData,
									summonerData.summonerName,
									summonerData.server,
								);
							})}
						</div>
					</Col>
				</Row>
			</div>
		) : fetchingData ? (
			<div className='no-data-align'>
				<Image
					src={require('../../images/emotes/hype-kitten.png')}
					alt='no data'
					className='no-data-img'
					loading='lazy'
				/>
				<h3 style={{ color: '#FFFFFF' }}>Fetching data for:</h3>
				<div className='no-data-summoner-name'>"{gameName}#{tagLine}"</div>
				<div className='d-flex align-items-start'>
					<span className="ellipsis-one">.</span>
					<span className="ellipsis-two">.</span>
					<span className="ellipsis-three">.</span>
				</div>
			</div>
		) : (
			<div className='no-data-align'>
				<Image
					src={require('../../images/emotes/sad-kitten.png')}
					alt='no data'
					className='no-data-img'
					loading='lazy'
				/>
				<h3 style={{ color: '#FFFFFF' }}>
					Sorry! We couldn't find summoner data for:
				</h3>
				<div className='no-data-summoner-name'>"{gameName}#{tagLine}"</div>
			</div>
		)
	);
}
export default Summoner;
