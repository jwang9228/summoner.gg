import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import * as client from './client.js';
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
			response && setSummonerData(response);
		};
		fetchData();
	}, [server, summonerName]);
	// TODO: try to break the parts into separate components here
	return summonerData ? (
		<Row className='align-items-center ms-3'>
			<Col xs='auto' className='position-relative'>
				<Image
					src={require(`../data-dragon/profile-icons/${summonerData.profileIconId}.png`)}
					alt='profile icon'
					className='profile-icon'
					loading='lazy'
				/>
				<div className='position-absolute start-50 translate-middle-x summoner-level-margin'>
					<p className='summoner-level'>
						{summonerData.summonerLevel}
					</p>
				</div>
			</Col>
			<Col xs='auto'>
				<p className='summoner-name'>
					{summonerData.summonerName}
					<span className='app-blue-accent ms-2 summoner-server'>{`#${(summonerData.server).toUpperCase()}`}</span>
				</p>
				<div>
					<Button className='app-blue-accent'>Update</Button>
				</div>
				<div>
					<Button className='app-blue-accent'>Update</Button>
				</div>
			</Col>
		</Row>
	) : (
		<div>
			<h3 style={{ color: '#FFFFFF' }}>No summoner data found!</h3>
		</div>
	);
}
export default Summoner;
