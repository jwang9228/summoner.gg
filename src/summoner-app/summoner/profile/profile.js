import { Image, Button } from 'react-bootstrap';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from 'react-icons/md';
import { useState, useEffect } from 'react';
import * as client from '../../users/client';
import './profile.css';
import LoginModal from '../modals/login-modal.js';
import SuccessModal from '../modals/success-modal.js';
import RemoveModal from '../modals/remove-modal.js';

function SummonerProfile({ summonerData }) {
	const [loggedInUser, setLoggedInUser] = useState();
	const [favorited, setFavorited] = useState(); // TODO: initial value will be either false or if logged in, if this summoner is already favorited
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showFavoriteModal, setShowFavoriteModal] = useState(false);
	const [showMySummonerModal, setShowMySummonerModal] = useState(false);
	const [showRemoveSummonerModal, setShowRemoveSummonerModal] = useState(false);

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
		setLoggedInUser(prevUserState => ({
			...prevUserState,
			mySummoner: {
				summonerName: summonerData.summonerName,
				region: summonerData.server
			}
		}));
		const updatedUser = {
			...loggedInUser,
			mySummoner: {
				summonerName: summonerData.summonerName,
				region: summonerData.server
			}
		};
		await client.updateUser(updatedUser);
	};
	
	const removeMySummoner = async () => {
		setShowRemoveSummonerModal(false);
		setLoggedInUser(prevUserState => ({
			...prevUserState,
			mySummoner: {
				summonerName: undefined,
				region: undefined
			}
		}));
		const updatedUser = {
			...loggedInUser,
			mySummoner: {
				summonerName: undefined,
				region: undefined
			}
		};
		await client.updateUser(updatedUser);
	};

	useEffect(() => {
		const fetchAccount = async () => {
			const loggedIn = await client.account();
			setLoggedInUser(loggedIn);
		};
		fetchAccount();
	}, []);

	return (
		<div className='profile-header'>
			<div className='position-relative profile-icon-margins'>
				<Image
					src={require(`../../../data-dragon/profileicon/${summonerData.profileIconId}.png`)}
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
					{(loggedInUser?.mySummoner?.summonerName === summonerData.summonerName && loggedInUser?.mySummoner?.region === summonerData.server) ? (
						<MdOutlineBookmarkAdded
							size={36}
							className='bookmark-button'
							onClick={() => {
								loggedInUser ? setShowRemoveSummonerModal(true) : setShowLoginModal(true);
							}}
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
			<RemoveModal 
				show={showRemoveSummonerModal}
				onHide={() => removeMySummoner()}
				close={() => setShowRemoveSummonerModal(false)}
				summonername={summonerData.summonerName}
				region={summonerData.server}
				description='removed as my summoner.'
			/>
		</div>
	);
}
export default SummonerProfile;
