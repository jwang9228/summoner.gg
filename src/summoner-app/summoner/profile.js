import { Image, Button } from 'react-bootstrap';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { useState } from 'react';
import { useSelector } from 'react-redux';

function SummonerProfile({ summonerData }) {
	const [favorited, setFavorited] = useState(false); // TODO: initial value will be either false or if logged in, if this summoner is already favorited
	const loggedIn = useSelector((state) => state.userReducer.loggedIn);
	const favoriteSummoner = () => {
		console.log('attempting to favorite');
		console.log(loggedIn);
		if (loggedIn) {
			setFavorited(true);
			// TODO: add this summoner to a user's favorited summoners
		} else {
			// TODO: some message saying a user must log in w/ some dialog for cancel or go to login
		}
	};
	const unfavoriteSummoner = () => {
		if (loggedIn) {
			setFavorited(false);
			// TODO: remove this summoner from a user's favorited summoners
		} else {
			// TODO: some message saying a user must log in w/ some dialog for cancel or go to login
		}
	};
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
				<span>
					<Button className='app-blue-accent me-3'>Update</Button>
					{favorited ? (
						<IoIosStar
							className='favorite-summoner-button me-1'
							size={36}
							onClick={() => unfavoriteSummoner()}
						/>
					) : (
						<IoIosStarOutline
							className='not-favorite-summoner-button me-1'
							size={36}
							onClick={() => favoriteSummoner()}
						/>
					)}
				</span>
				<span>
						<MdOutlineBookmarkAdd
							size={36}
							className='bookmark-button'
						/>
				</span>
			</div>
		</div>
	);
}
export default SummonerProfile;
