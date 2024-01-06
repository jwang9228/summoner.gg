import { ListGroup, Image } from 'react-bootstrap';
import './winrates.css';

function getRank(tier, rank) {
	if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
		return '';
	} else {
		const rankMapping = {
			'I': '1',
			'II': '2',
			'III': '3',
			'IV': '4',
		};
		return rankMapping[rank] || '';
	}
}

function Winrates({ queueData, queueName }) {
	const tier = queueData?.tier;
    const wins = queueData?.win;
    const losses = queueData?.loss;
    const totalGames = wins + losses;
	return (
		<div>
			<ListGroup className='m-auto mt-2'>
				<ListGroup.Item className='list-group-item-secondary queue-data-header d-flex justify-content-between'>
					<span>{queueName}</span>
					{!queueData && (
						<span className='unranked-label'>Unranked</span>
					)}
				</ListGroup.Item>
				{queueData && (
					<ListGroup.Item className='queue-data-body d-flex justify-content-between align-items-start'>
						<div className='d-flex align-items-center'>
							<Image
								src={require(`../../../images/rank-crests/${tier}.png`)}
								alt='rank crest'
								className='rank-crest'
								loading='lazy'
							/>
							<div className='ms-3 mb-2 d-flex flex-column'>
								<p className='rank-label mb-0 mt-0'>
									{`${tier.charAt(0)}${tier
										.toLowerCase()
										.slice(1)} ${getRank(
										tier,
										queueData.rank
									)}`}
								</p>
								<p className='league-points mb-0'>{`${queueData.leaguePoints} LP`}</p>
							</div>
						</div>
						<span>
							<div className='d-flex flex-column win-loss-margin-top'>
								<p className='win-loss-label mb-1'>
									{`${wins}W ${losses}L`}
								</p>
								{totalGames !== 0 && <p className='win-loss-label mb-0'>{`${Math.round((wins / (wins + losses)) * 100)}% Win Rate`}</p> }
							</div>
						</span>
					</ListGroup.Item>
				)}
			</ListGroup>
		</div>
	);
}
export default Winrates;
