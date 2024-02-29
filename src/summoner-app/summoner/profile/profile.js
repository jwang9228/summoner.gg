import { Image, Button } from 'react-bootstrap';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkAdded } from 'react-icons/md';
import { useState, useEffect } from 'react';
import * as client from '../../users/client';
import * as summonerClient from '../client.js';
import LoginModal from '../modals/login-modal.js';
import SuccessModal from '../modals/success-modal.js';
import RemoveModal from '../modals/remove-modal.js';
import './profile.css';

function SummonerProfile({ summonerData, updateSummoner, setUsersWhoFavorited }) {
	const [loggedInUser, setLoggedInUser] = useState();
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showFavoriteModal, setShowFavoriteModal] = useState(false);
	const [showRemoveFavoriteModal, setShowRemoveFavoriteModal] = useState(false);
	const [showMySummonerModal, setShowMySummonerModal] = useState(false);
	const [showRemoveSummonerModal, setShowRemoveSummonerModal] = useState(false);

	const favoriteSummoner = async () => {
		setShowFavoriteModal(false);
		const newSummoner = {
			summonerName: summonerData.summonerName,
			region: summonerData.server
		};
		setLoggedInUser(prevUserState => ({
			...prevUserState,
			favoriteSummoners: [...prevUserState.favoriteSummoners, newSummoner]
		}));
		const updatedUser = {
			...loggedInUser,
			favoriteSummoners: [...loggedInUser.favoriteSummoners, newSummoner]
		};
		await client.updateUser(updatedUser);

		if (!summonerData.favoritedBy.find(favorite => favorite.username === loggedInUser.username)) {
			await summonerClient.updateSummoner({
				...summonerData,
				favoritedBy: [...summonerData.favoritedBy, {'username': loggedInUser.username, 'userId': loggedInUser._id}]
			});
			setUsersWhoFavorited([...summonerData.favoritedBy, {'username': loggedInUser.username, 'userId': loggedInUser._id}]);
		}
	};

	const unfavoriteSummoner = async () => {
		setShowRemoveFavoriteModal(false);
		const filteredFavoriteSummoners = 
			loggedInUser.favoriteSummoners.filter(summoner => (summoner.summonerName !== summonerData.summonerName && summoner.region !== summonerData.server));
		setLoggedInUser(prevUserState => ({
			...prevUserState,
			favoriteSummoners: filteredFavoriteSummoners
		}));
		const updatedUser = {
			...loggedInUser,
			favoriteSummoners: filteredFavoriteSummoners
		};
		await client.updateUser(updatedUser);

		const filteredFavoritedBy = 
			summonerData.favoritedBy.filter(user => (user.username !== loggedInUser.username));
		await summonerClient.updateSummoner({
			...summonerData,
			favoritedBy: filteredFavoritedBy
		});

		setUsersWhoFavorited(filteredFavoritedBy);
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
					src={require(`../../../data-dragon/profileicon/${(summonerData.profileIconId).toString()}.png`)}
					alt='profile icon'
					className='profile-icon'
					loading='lazy'
				/>
				<span className='d-flex justify-content-center align-items-center position-absolute start-50 translate-middle-x summoner-level-margin'>
					<p className='summoner-level'>
						{summonerData.summonerLevel}
					</p>
				</span>
			</div>
			<div className='ms-3'>
				<p className='summoner-name'>
					{summonerData.summonerName}
					<span className='app-blue-accent ms-2 summoner-server'>{`#${summonerData.tagLine}`}</span>
				</p>
				<span>
					<Button className='app-blue-accent me-3' onClick={() => updateSummoner()}>
						Update
					</Button>
					{(false) ? (
						<IoIosStar
							className='favorite-summoner-button me-1'
							size={36}
							onClick={() => {
								loggedInUser ? setShowRemoveFavoriteModal(true) : setShowLoginModal(true);
							}}
						/>
					) : (
						<IoIosStarOutline
							className='not-favorite-summoner-button me-1'
							size={36}
							onClick={() => {
								loggedInUser ? setShowFavoriteModal(true) : setShowLoginModal(true);
							}}
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
				onHide={() => favoriteSummoner()}
				close={() => setShowFavoriteModal(false)}
				summonername={summonerData.summonerName}
				region={summonerData.server}
				description='added to my favorites!'
			/>
			<RemoveModal 
				show={showRemoveFavoriteModal}
				onHide={() => unfavoriteSummoner()}
				close={() => setShowRemoveFavoriteModal(false)}
				summonername={summonerData.summonerName}
				region={summonerData.server}
				description='removed from my favorites.'
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
