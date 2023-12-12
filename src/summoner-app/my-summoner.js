import { useState, useEffect } from 'react';
import * as client from './users/client';
import * as summonerClient from './summoner/client';
import { ListGroup, Image, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

function MySummoner() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [mySummoner, setMySummoner] = useState();
	const [summonerData, setSummonerData] = useState();
	const navigate = useNavigate();

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

	function renderQueueData(queueData) {
		return (
			<div className='mt-1'>
				<div className='d-flex'>
					<span className='rank-label'>
						{`${queueData.tier.charAt(
							0
						)}${queueData.tier
							.toLowerCase()
							.slice(1)} ${getRank(
							queueData.tier,
							queueData.rank
						)}`}
					</span>
					<Image
						src={require(`../images/rank-crests/${queueData.tier}.png`)}
						alt='rank crest'
						className='ms-2 my-rank-crest'
						loading='lazy'
					/>
				</div>
				<div className='rank-label'>{`${queueData.leaguePoints} LP`}</div>
			</div>
		);
	}

	function renderRank(summonerData) {
		const soloQueueData = summonerData.soloQueueRank;
		const flexQueueData = summonerData.flexQueueRank;
		if (soloQueueData) {
			return renderQueueData(soloQueueData);
		} else if (flexQueueData) {
			return renderQueueData(flexQueueData);
		} else {
			return (
				<p className='rank-label'>Unranked</p>
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
			<ListGroup className='m-auto my-summoner-width'>
				<ListGroup.Item className='my-summoner-background d-flex align-items-center mt-4'>
					<Image
						src={require(`../data-dragon/profileicon/${summonerData.profileIconId}.png`)}
						alt='profile icon'
						className='my-profile-icon mt-1'
						loading='lazy'
					/>
					<span className='ms-3'>
						<div className='summoner-name-label'>
							{summonerData.summonerName}
							<span>#{summonerData.server.toUpperCase()}</span>
						</div>
						{renderRank(summonerData)}
					</span>
				</ListGroup.Item>
				<ListGroup.Item className='my-summoner-background'>
					<Button 
						className='view-details-button'
						onClick={() => navigate(`/results/${summonerData.server}/${summonerData.summonerName}`)}
					>
						View Details
					</Button>
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
						</Link>
						to register a summoner as your own!
					</span>
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
export default MySummoner;
