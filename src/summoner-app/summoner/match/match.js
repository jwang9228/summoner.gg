import './match.css';
import { Image, Row, Col } from 'react-bootstrap';
import gameModes from "./gamemodes.json";
import summonerSpells from "./summoners.json";
import runes from "./runes.json";

function RenderMatch(matchData, summonerName) {

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

	let matchResultStyle = undefined;
	let matchResultTextStyle = undefined;
	if (myPlayer.matchResult === 'Victory') {
		matchResultStyle = 'win';
		matchResultTextStyle = 'win-text';
	} else if (myPlayer.matchResult === 'Defeat') {
		matchResultStyle = 'loss';
		matchResultTextStyle = 'loss-text';
	} else {
		matchResultStyle = 'remake';
		matchResultTextStyle = 'remake-text';
	}

	const summonerSpell1 = summonerSpells.find(summonerSpell => summonerSpell.key === myPlayer.summonerSpells[0]).name;
	const summonerSpell2 = summonerSpells.find(summonerSpell => summonerSpell.key === myPlayer.summonerSpells[1]).name;

	const primaryTreeId = myPlayer.primaryRunes.primaryTree.toString().trim();
	const primaryTreeKeystones = runes.find(runeTrees => runeTrees.id.toString().trim() === primaryTreeId).slots[0].runes;
	const primaryKeystoneId = myPlayer.primaryRunes.runes[0].toString().trim();
	const primaryKeystone = primaryTreeKeystones.find(keystone => keystone.id.toString().trim() === primaryKeystoneId).icon;

	const secondaryTreeId = myPlayer.secondaryRunes.secondaryTree.toString().trim();
	const secondaryTree = runes.find(runeTrees => runeTrees.id.toString().trim() == secondaryTreeId).icon;

	return (
		<Row
			className={`mb-2 d-flex ${matchResultStyle} rounded`}
			key={metadata.matchId}
		>
			<Col xl={8} lg={8} md={12} sm={12} xs={12} className='d-flex'>
				<div className='d-flex flex-column justify-content-between' style={{width: '95px'}}>
					<p className={`mt-2 ${matchResultTextStyle}`}>{gameModes.find(gameMode => gameMode.queueId === matchInfo.queueId).gameMode}</p>
					<div className='mt-auto'>
						<p className='match-result mb-0 mt-0'>{myPlayer.matchResult}</p>
						<p className='game-duration mb-2 mt-0'>
							{(hours !== 0) && `${hours}h`} {(minutes !== 0) && `${minutes}m`} {(seconds !== 0) && `${seconds}s`}
						</p>
					</div>
				</div>
				<Image
					src={require(`../../../data-dragon/champion/${myPlayer.champion}_0.jpg`)}
					alt='my champion icon'
					className='my-champion-icon mt-3 ms-4'
					loading='lazy'
					roundedCircle
				/>
				<div className='d-flex flex-column'>
					<div>
						<Image
							src={require(`../../../data-dragon/summoner-spells/${summonerSpell1}.png`)}
							alt='summoner 1'
							className='my-summoner-spell-icon mt-3 ms-1'
							loading='lazy'
						/>
						<Image
							src={require(`../../../data-dragon/summoner-spells/${summonerSpell2}.png`)}
							alt='summoner 2'
							className='my-summoner-spell-icon mt-3 ms-1'
							loading='lazy'
						/>
					</div>
					<div>
						<Image
							src={require(`../../../data-dragon/${primaryKeystone}`)}
							alt='primary rune'
							className='my-runes-icon ms-1'
							loading='lazy'
						/>
						<Image
							src={require(`../../../data-dragon/${secondaryTree}`)}
							alt='secondary rune'
							className='my-runes-icon ms-1'
							loading='lazy'
						/>
					</div>
				</div>
			</Col>
			<Col xl={4} lg={4} md={0} sm={0} xs={0} className='d-none d-lg-flex justify-content-end'>
				{Object.values(teamData).map((team) => {
					return (
						<span>
							{orderTeamByRole(team).map((player) => {
								return (
									<div className='d-flex align-items-center mb-0 mt-0'>
										<Image
											src={require(`../../../data-dragon/champion/${player.champion}_0.jpg`)}
											alt='champion icon'
											className='champion-icon'
											loading='lazy'
										/>
										<p className={`player-name ${myPlayer.name === player.name ? 'my-player-name' : ''}`}>
											{player.name}
										</p>
									</div>
								);
							})}
						</span>
					);
				})}
			</Col>
		</Row>
	);
}
export default RenderMatch;
