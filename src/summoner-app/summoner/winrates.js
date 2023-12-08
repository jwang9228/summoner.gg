import { ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import './winrates.css';

function getRank(tier, rank) {
	if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
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
					<ListGroupItem className='queue-data-body d-flex justify-content-between align-items-start'>
						<div className='d-flex align-items-center'>
							<Image
								src={require(`../../images/rank-crests/${tier}.png`)}
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
					</ListGroupItem>
				)}
			</ListGroup>
		</div>
	);
}
export default Winrates;
