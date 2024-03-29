import './match.css';
import { Image, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import gameModes from "./gamemodes.json";
import summonerSpells from "./summoners.json";
import runes from "./runes.json";

function RenderMatch(matchData, summonerName, region) {

	const [playerName] = summonerName.split('-');

	const metadata = matchData.metadata;
	const matchInfo = matchData.info;

	if (!gameModes.find(gameMode => gameMode.queueId === matchInfo.queueId)) {
		return;
	}

	const gameDurationSeconds = matchInfo.gameDuration;
	const playersData = matchInfo.participants;

	const getMatchTime = () => {
		const hours = Math.floor(gameDurationSeconds / 3600);
		const minutes = Math.floor((gameDurationSeconds % 3600) / 60);
		const seconds = gameDurationSeconds % 60;
		return { hours, minutes, seconds };
	};
	const { hours, minutes, seconds } = getMatchTime();

	const calculateKDA = (kills, deaths, assists) => {
		if (deaths === 0) { 
			deaths = 1;
		}
		return ((kills + assists) / deaths).toFixed(2)
	}

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
			tagline: player.riotIdTagline,
			timePlayed: player.timePlayed,
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
		if (player.riotIdGameName === playerName) {
			myPlayer = playerData;
		}
	});

	const calculateMatchLastPlayed = () => {
		const timePlayedMs = myPlayer.timePlayed * 1000;
		const gameStartTime = matchInfo.gameStartTimestamp;
		const gameEndTime = gameStartTime + timePlayedMs;
		const currentTime = Date.now();
		// timeElapsed in ms
		const timeElapsed = currentTime - gameEndTime;
		// time in seconds since current time and when match ended
		const timeElapsedSeconds = Math.floor(timeElapsed / 1000);

		const secondsPerHour = 60 * 60;
		const secondsPerDay = secondsPerHour * 24;
		const secondsPerMonth = secondsPerDay * 31;
		
		let matchLastPlayed = undefined;
		// less than a minute ago
		if (timeElapsedSeconds < 60) {
			matchLastPlayed = timeElapsedSeconds + " seconds ago";
		} 
		// less than an hour ago
		else if (timeElapsedSeconds < secondsPerHour) {
			const timeElapsedMinutes = Math.floor(timeElapsedSeconds / 60);
			matchLastPlayed = (timeElapsedMinutes > 1) ? timeElapsedMinutes + " mins ago" : "a minute ago";
		}
		// less than a day ago
		else if (timeElapsedSeconds < secondsPerDay) {
			const timeElapsedHours = Math.floor(timeElapsedSeconds / secondsPerHour);
			matchLastPlayed = (timeElapsedHours > 1) ? timeElapsedHours + " hours ago" : "an hour ago";
		}
		// less than a month ago
		else if (timeElapsedSeconds < secondsPerMonth) {
			const timeElapsedDays = Math.floor(timeElapsedSeconds / secondsPerDay);
			matchLastPlayed = (timeElapsedDays > 1) ? timeElapsedDays + " days ago" : "a day ago";
		}
		// a month or longer
		else {
			const timeElapsedMonths = Math.floor(timeElapsedSeconds / secondsPerMonth);
			matchLastPlayed = (timeElapsedMonths > 1) ? timeElapsedMonths + " months ago" : "a month ago";
		}
		return matchLastPlayed;
	}
	const matchLastPlayed = calculateMatchLastPlayed();

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
	let matchResultItem = undefined;
	if (myPlayer.matchResult === 'Victory') {
		matchResultPrefix = 'win';
	} else if (myPlayer.matchResult === 'Defeat') {
		matchResultPrefix = 'loss';
	} else {
		matchResultPrefix = 'remake';
	}
	matchResultStyle = matchResultPrefix;
	matchResultTextStyle = matchResultPrefix + '-text';
	matchResultItem = matchResultPrefix + '-item';

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
			<Col xl={8} lg={8} md={12} sm={12} xs={12} className='d-flex mt-1'>
				<div className='d-flex flex-column justify-content-between mb-0 match-result-dimensions'>
					<p className={`mb-0 ${matchResultTextStyle} game-mode-size`}>{gameModes.find(gameMode => gameMode.queueId === matchInfo.queueId).gameMode}</p>
					<div className='mt-auto'>
						<p className='game-played game-played-size my-0'>{matchLastPlayed}</p>
						<p className='game-duration mb-1 mt-0'>
							{(hours !== 0) && `${hours}h`} {(minutes !== 0) && `${minutes}m`} {(seconds !== 0) && `${seconds}s`}
						</p>
					</div>
				</div>
				<div className='d-flex flex-column'>
					<div className='d-flex flex-row'>
						<div className='position-relative my-champion-margins'>
							<div className='d-flex justify-content-center align-items-center my-champion-container'>
								<Image
									src={require(`../../../data-dragon/champion/${myPlayer.champion}.png`)}
									alt='my champion icon'
									className='my-champion-icon'
									loading='lazy'
									rounded
								/>
							</div>
							<span className='d-flex justify-content-center align-items-center position-absolute my-player-level my-player-level-size'>{myPlayer.level}</span>
						</div>
						<div className='d-flex flex-column ms-1'> 
							<div className='spells-margin-top'>
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
						<div className='d-flex flex-column'>
							<div className='stats-margins'>
								<span className='positive-stat'>{myPlayer.kills}</span>
								<span className='stat-divider'> / </span>
								<span className='negative-stat'>{myPlayer.deaths}</span>
								<span className='stat-divider'> / </span>
								<span className='positive-stat'>{myPlayer.assists}</span>
							</div>
							<div className='kda justify-content-center'>
								{`${calculateKDA(myPlayer.kills, myPlayer.deaths, myPlayer.assists)} KDA`}
							</div>
						</div>
					</div>
					<div className='items-margins'>
						{myPlayer.items.map((item) => (
							<span>
								<Image
									src={(item !== 0) ? require(`../../../data-dragon/item/${item}.png`) : require(`../../../images/blank-items/${matchResultItem}.png`)}
									alt='item'
									className='my-item'
									loading='lazy'
								/>
							</span>
						))}
					</div>
				</div>
			</Col>
			<Col xl={4} lg={4} md={0} sm={0} xs={0} className='d-flex justify-content-end d-none d-lg-flex'>
				{Object.values(teamData).map((team) => (
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
									to={`../results/${region}/${player.name}-${player.tagline}`}
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
		</Row>
	);
}
export default RenderMatch;
