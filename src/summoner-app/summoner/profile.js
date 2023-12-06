import { Row, Col, Image, Button } from 'react-bootstrap';

function SummonerProfile({ summonerData }) {
	return (
		<Row className='align-items-center ms-3'>
			<Col xs='auto' className='position-relative'>
				<Image
					src={require(`../../data-dragon/profile-icons/${summonerData.profileIconId}.png`)}
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
					<span className='app-blue-accent ms-2 summoner-server'>{`#${summonerData.server.toUpperCase()}`}</span>
				</p>
				<div>
					<Button className='app-blue-accent'>Update</Button>
				</div>
			</Col>
		</Row>
	);
}
export default SummonerProfile;
