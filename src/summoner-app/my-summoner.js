import { useState, useEffect } from 'react';
import * as client from './users/client';
import * as summonerClient from './summoner/client';
import { ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './home.css';

function MySummoner() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [mySummoner, setMySummoner] = useState();
	const [summonerData, setSummonerData] = useState();

	function getRank(tier, rank) {
		if (
			tier === 'MASTER' ||
			tier === 'GRANDMASTER' ||
			tier === 'CHALLENGER'
		) {
			return '';
		} else {
			switch (rank) {
				case 'I':
					return '1';
				case 'II':
					return '2';
				case 'III':
					return '3';
				case 'IV':
					return '4';
				default:
					return '';
			}
		}
	}

	function renderRank(summonerData) {
		const soloQueueData = summonerData.soloQueueRank;
		const flexQueueData = summonerData.flexQueueRank;
		if (soloQueueData) {
			return (
				<div>
					<span className='rank-label'>
						{`${soloQueueData.tier.charAt(0)}${soloQueueData.tier
							.toLowerCase()
							.slice(1)} ${getRank(
							soloQueueData.tier,
							soloQueueData.rank
						)}`}
					</span>
					<span className='league-points'>{`${soloQueueData.leaguePoints} LP`}</span>
				</div>
			);
		} else if (flexQueueData) {
			return (
				<div>
					<span className='rank-label'>
						{`${flexQueueData.tier.charAt(0)}${flexQueueData.tier
							.toLowerCase()
							.slice(1)} ${getRank(
							flexQueueData.tier,
							flexQueueData.rank
						)}`}
					</span>
					<span className='league-points'>{`${flexQueueData.leaguePoints} LP`}</span>
				</div>
			);
		} else {
			return (
				<div>
					<p className='league-points mb-0'>Unranked</p>
				</div>
			);
		}
	}

	useEffect(() => {
		const fetchAccount = async () => {
			const currentUser = await client.account();
			setLoggedIn(currentUser);
			setMySummoner(currentUser?.mySummoner);
			const summonerData = await summonerClient.findSummonerByServer(
				mySummoner?.region,
				mySummoner?.summonerName
			);
			setSummonerData(summonerData);
		};
		fetchAccount();
	}, [mySummoner?.region, mySummoner?.summonerName]);
	return loggedIn ? (
		summonerData ? (
			<ListGroup>
				<ListGroup.Item className='my-summoner-background d-flex align-items-center m-auto mt-5'>
					<div className='position-relative'>
						<Image
							src={require(`../data-dragon/profileicon/${summonerData.profileIconId}.png`)}
							alt='profile icon'
							className='profile-icon'
							loading='lazy'
						/>
						<span className='position-absolute start-50 translate-middle-x summoner-level-margin'>
							<p className='summoner-level'>
								{summonerData.summonerLevel}
							</p>
						</span>
					</div>
					<span className='ms-3'>
						<div className='summoner-name-label'>
							{summonerData.summonerName}
							<span>#{summonerData.server.toUpperCase()}</span>
						</div>
						{renderRank(summonerData)}
					</span>
				</ListGroup.Item>
			</ListGroup>
		) : (
			<ListGroup>
				<ListGroup.Item className='my-summoner-background d-flex align-items-center m-auto mt-5'>
					<Image
						src={require(`../images/blitz-question.png`)}
						alt='register summoner icon'
						className='register-summoner-icon ms-1 me-2'
						loading='lazy'
					/>
					<span className='register-summoner-label'>
						Search for a summoner and bookmark to register your
						summoner!
					</span>
				</ListGroup.Item>
			</ListGroup>
		)
	) : (
		<div>
			<ListGroup>
				<ListGroup.Item className='my-summoner-background d-flex align-items-center m-auto mt-5'>
					<Image
						src={require(`../images/blitz-question.png`)}
						alt='register summoner icon'
						className='register-summoner-icon ms-1 me-2'
						loading='lazy'
					/>
					<span className='register-summoner-label'>
						<Link to='./login' style={{ textDecoration: 'none' }}>
							Login
						</Link>{' '}
						to register a summoner as your own!
					</span>
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
export default MySummoner;
