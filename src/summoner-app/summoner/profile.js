import { Image, Button } from 'react-bootstrap';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import { useState, useEffect } from 'react';
import * as client from "../users/client";

function SummonerProfile({ summonerData }) {
	const [favorited, setFavorited] = useState(false); // TODO: initial value will be either false or if logged in, if this summoner is already favorited
	const [loggedIn, setLoggedIn] = useState(false);
	const favoriteSummoner = () => {
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

	useEffect(() => {
		const fetchAccount = async () => {
			const loggedIn = await client.account();
			setLoggedIn(loggedIn);
		};
		fetchAccount();
	}, []);

	return (
		<div className='profile-header'>
			<div className='position-relative profile-icon-margins'>
				<Image
					src={require(`../../data-dragon/profileicon/${summonerData.profileIconId}.png`)}
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
					<Button className='app-blue-accent me-3' onClick={() => {}}>
						Update
					</Button>
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
