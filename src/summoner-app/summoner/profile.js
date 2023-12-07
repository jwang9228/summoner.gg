import { Image, Button } from 'react-bootstrap';

function SummonerProfile({ summonerData }) {
	return (
		<div className='profile-header'>
			<div className='position-relative profile-icon-margins'>
				<Image
					src={require(`../../data-dragon/profile-icons/${summonerData.profileIconId}.png`)}
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
			<div className='ms-3'>
				<p className='summoner-name'>
					{summonerData.summonerName}
					<span className='app-blue-accent ms-2 summoner-server'>{`#${summonerData.server.toUpperCase()}`}</span>
				</p>
				<Button className='app-blue-accent'>Update</Button>
			</div>
		</div>
	);
}
export default SummonerProfile;
