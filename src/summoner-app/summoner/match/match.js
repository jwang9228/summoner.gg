import './match.css';
import { Image } from 'react-bootstrap';

function RenderMatch(matchData, summonerName) {
	const ACCEPTED_GAME_MODES = ['ARAM', 'CLASSIC'];

	const metadata = matchData.metadata;
	const matchInfo = matchData.info;
	const gameDurationSeconds = matchInfo.gameDuration;
	const playersData = matchInfo.participants;

	const getMatchTime = (gameDurationSeconds) => {
		const hours = Math.floor(gameDurationSeconds / 3600);
		const minutes = Math.floor((gameDurationSeconds % 3600) / 60);
		const seconds = gameDurationSeconds % 60;
		return { hours, minutes, seconds };
	};
	// const { hours, minutes, seconds } = getMatchTime(gameDurationSeconds);

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
			summonerSpells: [player.summoner1Id, player.summoner2Id],
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
	//console.log(`team data: ${JSON.stringify(teamData)}`);

	/* TODO: 
        overall data to display (besides player data):
       -- win, loss, remake. 
       -- game duration
       -- check wukong = monkey king
       -- team positions: TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY, "" -> aram
       -- calculate KDA

       stretch:
       -- lp gains 
       -- how long ago was this match?
    */

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

	// TODO: get the overall style here depending on win/loss/remake
	let matchResultStyle = undefined;
	if (myPlayer.matchResult === 'Victory') {
		matchResultStyle = 'win';
	} else if (myPlayer.matchResult === 'Defeat') {
		matchResultStyle = 'loss';
	} else {
		matchResultStyle = 'remake';
	}

	return (
		ACCEPTED_GAME_MODES.includes(matchInfo.gameMode) && (
			<div
				className={`mb-2 d-flex justify-content-between ${matchResultStyle} rounded`}
				key={metadata.matchId}
			>
				<div>Left content</div>
				<div className='d-flex'>
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
				</div>
			</div>
		)
	);
}
export default RenderMatch;
