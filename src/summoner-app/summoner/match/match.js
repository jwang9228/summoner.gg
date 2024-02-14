import './match.css';
import { Image, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaAngleDown } from "react-icons/fa";
import gameModes from "./gamemodes.json";
import summonerSpells from "./summoners.json";
import runes from "./runes.json";

function RenderMatch(matchData, summonerName, region) {

	const metadata = matchData.metadata;
	const matchInfo = matchData.info;

	if (!gameModes.find(gameMode => gameMode.queueId === matchInfo.queueId)) {
		return;
	}

	const gameDurationSeconds = matchInfo.gameDuration;
	const playersData = matchInfo.participants;

	const getMatchTime = (gameDurationSeconds) => {
		const hours = Math.floor(gameDurationSeconds / 3600);
		const minutes = Math.floor((gameDurationSeconds % 3600) / 60);
		const seconds = gameDurationSeconds % 60;
		return { hours, minutes, seconds };
	};
	const { hours, minutes, seconds } = getMatchTime(gameDurationSeconds);

	const getMatchResult = (player) => {
		if (player.gameEndedInEarlySurrender) {
			return 'Remake';
		} else {
			return player.win ? 'Victory' : 'Defeat';
		}
	};

	const teamData = {};
	let myPlayer = undefined;

	playersData.forEach((player) => {
		const playerTeamId = player.teamId;
		if (!teamData[playerTeamId]) {
			teamData[playerTeamId] = [];
		}
		const playerStatRunes = player.perks.statPerks;
		const playerRunes = player.perks.styles;
		const playerPrimaryRunes = playerRunes[0];
		const playerSecondaryRunes = playerRunes[1];
		const playerData = {
			name: player.riotIdGameName,
			champion: player.championName,
			matchResult: getMatchResult(player),
			kills: player.kills,
			deaths: player.deaths,
			assists: player.assists,
			level: player.champLevel,
			role: player.teamPosition,
			items: [
				player.item0,
				player.item1,
				player.item2,
				player.item3,
				player.item4,
				player.item5,
				player.item6,
			],
			summonerSpells: [player.summoner1Id.toString(), player.summoner2Id.toString()],
			primaryRunes: {
				primaryTree: playerPrimaryRunes.style,
				runes: playerPrimaryRunes.selections.map(
					(selection) => selection.perk
				),
			},
			secondaryRunes: {
				secondaryTree: playerSecondaryRunes.style,
				runes: playerSecondaryRunes.selections.map(
					(selection) => selection.perk
				),
			},
		};
		teamData[playerTeamId].push(playerData);
		if (player.riotIdGameName === summonerName) {
			myPlayer = playerData;
		}
	});

	const orderTeamByRole = (team) => {
		const roleOrder = {
			TOP: 1,
			JUNGLE: 2,
			MIDDLE: 3,
			BOTTOM: 4,
			UTILITY: 5,
		};

		return matchInfo.gameMode === 'ARAM'
			? team
			: team.sort((a, b) => {
					return roleOrder[a.role] - roleOrder[b.role];
			  });
	};

	let matchResultPrefix = undefined;
	let matchResultStyle = undefined;
	let matchResultTextStyle = undefined;
	let matchResultMoreDetails = undefined;
	if (myPlayer.matchResult === 'Victory') {
		matchResultPrefix = 'win';
	} else if (myPlayer.matchResult === 'Defeat') {
		matchResultPrefix = 'loss';
	} else {
		matchResultPrefix = 'remake';
	}
	matchResultStyle = matchResultPrefix;
	matchResultTextStyle = matchResultPrefix + '-text';
	matchResultMoreDetails = matchResultPrefix + '-more-details';

	const summonerSpell1 = summonerSpells.find(summonerSpell => summonerSpell.key === myPlayer.summonerSpells[0]).name;
	const summonerSpell2 = summonerSpells.find(summonerSpell => summonerSpell.key === myPlayer.summonerSpells[1]).name;

	const primaryTreeId = myPlayer.primaryRunes.primaryTree.toString().trim();
	const primaryTreeKeystones = runes.find(runeTrees => runeTrees.id.toString().trim() === primaryTreeId).slots[0].runes;
	const primaryKeystoneId = myPlayer.primaryRunes.runes[0].toString().trim();
	const primaryKeystone = primaryTreeKeystones.find(keystone => keystone.id.toString().trim() === primaryKeystoneId).icon;

	const secondaryTreeId = myPlayer.secondaryRunes.secondaryTree.toString().trim();
	const secondaryTree = runes.find(runeTrees => runeTrees.id.toString().trim() === secondaryTreeId).icon;

	return (
		<Row
			className={`m-auto mb-2 d-flex ${matchResultStyle} rounded`}
			key={metadata.matchId}
		>
			<Col xl={7} lg={7} md={11} sm={11} xs={11} className='d-flex'>
				<div className='d-flex flex-column justify-content-between mb-0' style={{width: '60px', height: '100px'}}>
					<p className={`mt-1 mb-0 ${matchResultTextStyle}`}>{gameModes.find(gameMode => gameMode.queueId === matchInfo.queueId).gameMode}</p>
					<div className='mt-auto'>
						<p className='match-result my-0'>{myPlayer.matchResult}</p>
						<p className='game-duration mb-1 mt-0'>
							{(hours !== 0) && `${hours}h`} {(minutes !== 0) && `${minutes}m`} {(seconds !== 0) && `${seconds}s`}
						</p>
					</div>
				</div>
				<div className='ms-1 mt-2'>
					<div className='d-flex justify-content-center align-items-center my-champion-container'>
						<Image
							src={require(`../../../data-dragon/champion/${myPlayer.champion}.png`)}
							alt='my champion icon'
							className='my-champion-icon'
							loading='lazy'
						/>
					</div>
				</div>
				<div className='d-flex flex-column ms-1 mt-2'>
					<div>
						<Image
							src={require(`../../../data-dragon/summoner-spells/${summonerSpell1}.png`)}
							alt='summoner 1'
							className='my-summoner-spell-icon ms-1'
							loading='lazy'
						/>
						<Image
							src={require(`../../../data-dragon/summoner-spells/${summonerSpell2}.png`)}
							alt='summoner 2'
							className='my-summoner-spell-icon ms-1'
							loading='lazy'
						/>
					</div>
					<div>
						<Image
							src={require(`../../../data-dragon/${primaryKeystone}`)}
							alt='primary rune'
							className='my-runes-icon'
							loading='lazy'
						/>
						<Image
							src={require(`../../../data-dragon/${secondaryTree}`)}
							alt='secondary rune'
							className='my-runes-icon-secondary'
							loading='lazy'
						/>
					</div>
				</div>
				<div>
					{myPlayer.kills}
					{myPlayer.deaths}
					{myPlayer.assists}
				</div>
			</Col>
			<Col xl={4} lg={4} md={0} sm={0} xs={0} className='d-flex justify-content-end d-none d-lg-flex'>
				{Object.values(teamData).map((team, index) => (
					<span className='team-margins'>
						{orderTeamByRole(team).map((player) => (
							<div className='d-flex align-items-center m-0' key={player.name}>
								<Image
									src={require(`../../../data-dragon/champion/${player.champion}.png`)}
									alt='champion icon'
									className='champion-icon'
									loading='lazy'
								/>
								<Link
									className='player-link'
									to={`../results/${region}/${player.name}`}
								>
									<p className={`my-0 player-name ${myPlayer.name === player.name ? 'my-player-name' : ''}`}>
										{player.name}
									</p>
								</Link>
							</div>
						))}
					</span>
				))}
			</Col>
			<Col xl={1} lg={1} md={1} sm={1} xs={1} className={`${matchResultMoreDetails} d-flex justify-content-center mx-0 px-0`}>
				test
			</Col>
		</Row>
	);
}
export default RenderMatch;
