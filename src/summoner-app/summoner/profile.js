import { Image, Button } from 'react-bootstrap';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from 'react-icons/md';
import { useState, useEffect } from 'react';
import * as client from '../users/client';
import './profile.css';
import LoginModal from './login-modal';
import SuccessModal from './success-modal';

function SummonerProfile({ summonerData }) {
	const [loggedInUser, setLoggedInUser] = useState(false);
	const [favorited, setFavorited] = useState(); // TODO: initial value will be either false or if logged in, if this summoner is already favorited
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showFavoriteModal, setShowFavoriteModal] = useState(false);
	const [showMySummonerModal, setShowMySummonerModal] = useState(false);

	const favoriteSummoner = () => {
		if (loggedInUser) {
			setShowFavoriteModal(true);
			// TODO: add this summoner to a user's favorited summoners
		} else {
			setShowLoginModal(true);
		}
	};

	const unfavoriteSummoner = () => {
		if (loggedInUser) {
			// TODO: remove this summoner from a user's favorited summoners
		} else {
			// TODO: some message saying a user must log in w/ some dialog for cancel or go to login
		}
	};

	const addMySummoner = async () => {
		setShowMySummonerModal(false);
		const updatedUser = {...loggedInUser, 'mySummoner': { 'summonerName': summonerData.summonerName, 'region': summonerData.server }}
		await client.updateUser(updatedUser);
	};

	const removeMySummoner = async () => {
		
	};

	useEffect(() => {
		const fetchAccount = async () => {
			const loggedIn = await client.account();
			setLoggedInUser(loggedIn);
			console.log(loggedIn);
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
					{(loggedInUser && loggedInUser.mySummoner) ? (
						<MdOutlineBookmarkAdded
							size={36}
							className='bookmark-button'
							onClick={() => removeMySummoner()}
						/>
					): (
						<MdOutlineBookmarkAdd
							size={36}
							className='bookmark-button'
							onClick={() => {
								loggedInUser ? setShowMySummonerModal(true) : setShowLoginModal(true);
							}}
						/>
					)}
				</span>
			</div>
			<LoginModal
				show={showLoginModal}
				onHide={() => setShowLoginModal(false)}
			/>
			<SuccessModal
				show={showFavoriteModal}
				onHide={() => setShowFavoriteModal(false)}
				close={() => setShowMySummonerModal(false)}
				summonername={summonerData.summonerName}
				region={summonerData.server}
				description='added to my favorites!'
			/>
			<SuccessModal
				show={showMySummonerModal}
				onHide={() => addMySummoner()}
				close={() => setShowMySummonerModal(false)}
				summonername={summonerData.summonerName}
				region={summonerData.server}
				description='set as my summoner!'
			/>
		</div>
	);
}
export default SummonerProfile;
