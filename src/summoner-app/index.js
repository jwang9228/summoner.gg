import './home.css';
import '../common/colors.css';
import regions from './regions.json';
import React from 'react';
import {
	Form,
	Button,
	InputGroup,
	Container,
	ListGroup,
	Image,
} from 'react-bootstrap';
import { CgSearch } from 'react-icons/cg';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as client from './summoner/client.js';

function SummonerApp() {
	const navigate = useNavigate();
	const [summonerName, setSummonerName] = useState('');
	const [selectedRegion, setSelectedRegion] = useState(regions[0]);
	const [showRegions, setShowRegions] = useState(false);
	const [showRecentSearches, setShowRecentSearches] = useState('');
	const [recentSearches, setRecentSearches] = useState();
	const [searchbarFocused, setSearchbarFocused] = useState(false);
	const inputRef = useRef('');
	useEffect(() => {
		if (searchbarFocused) {
			if (summonerName.length === 0) {
				setShowRegions(false);
				setShowRecentSearches(true);
			} else {
				setShowRecentSearches(false);
			}
		}
	}, [summonerName, searchbarFocused]);
	useEffect(() => {
		const getRecentSearches = async () => {
			const response = await client.getRecentSearches();
			setRecentSearches(response);
		};
		getRecentSearches();
		function handleClickOutside(event) {
			if (inputRef.current && !inputRef.current.contains(event.target)) {
				setShowRecentSearches(false);
			}
		}
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);
	const handleSearchbarChange = (e) => {
		setSummonerName(e.target.value);
		if (e.target.value.length === 0) {
			setShowRegions(false);
			setShowRecentSearches(true);
		} else {
			setShowRecentSearches(false);
		}
	};
	const handleSearchbarFocus = () => {
		setSearchbarFocused(true);
	};
	const handleSearchbarBlur = () => {
		setSearchbarFocused(false);
	};
	const searchSummonerEvent = (region, summonerName) => {
		if (summonerName !== '') {
			navigate(`/results/${region}/${summonerName}`);
		}
	};
	return (
		<Container>
			<p className='app-title mb-3'>
				SUMMONER
				<span className='app-blue-accent'>.</span>
				GG
			</p>
			<InputGroup className='m-auto searchbar-group' size='lg'>
				<InputGroup.Text className='white-background'>
					<Button
						className='selected-region-button'
						style={{ backgroundColor: selectedRegion.color }}
						size='sm'
						onClick={() => {
							setShowRegions(!showRegions);
						}}
					>
						{selectedRegion.name}
					</Button>
				</InputGroup.Text>
				<Form.Control
					placeholder='Search Summoners'
					className='border-0 search-bar'
					value={summonerName}
					onChange={handleSearchbarChange}
					onKeyUp={(e) => {
						if (e.key === 'Enter') {
							searchSummonerEvent(
								selectedRegion.server,
								summonerName
							);
						}
					}}
					onFocus={handleSearchbarFocus}
					onBlur={handleSearchbarBlur}
					ref={inputRef}
				/>
				<InputGroup.Text className='white-background'>
					<Button
						className='white-background search-button'
						onClick={() =>
							searchSummonerEvent(
								selectedRegion.server,
								summonerName
							)
						}
					>
						<CgSearch className='search-icon' size={24} />
					</Button>
				</InputGroup.Text>
			</InputGroup>
			{(showRecentSearches && (recentSearches.length > 0)) && (
				<ListGroup className='m-auto recent-searches mt-2'>
					<ListGroup.Item className='list-group-item-secondary'>
						Recently Searched
					</ListGroup.Item>
					{recentSearches.map((recentSearch) => (
						<ListGroup.Item
							action
							variant='light'
							className='d-flex justify-content-between'
							key={recentSearch.name}
							onClick={() =>
								searchSummonerEvent(
									recentSearch.region,
									recentSearch.name
								)
							}
						>
							<span>
								<Image
									src={require(`../data-dragon/profile-icons/${recentSearch.profileIconId}.png`)}
									alt='profile icon'
									className='search-profile-icon me-2'
									loading='lazy'
								/>
								{recentSearch.name}
							</span>
							<span
								className='recent-search-button btn btn-sm'
								style={{
									backgroundColor: regions.find(
										(region) =>
											region.server ===
											recentSearch.region
									).color,
								}}
							>
								{
									regions.find(
										(region) =>
											region.server ===
											recentSearch.region
									).name
								}
							</span>
						</ListGroup.Item>
					))}
				</ListGroup>
			)}
			{showRegions && (
				<Container>
					<div className='text-center'>
						{regions.map((region) => (
							<Button
								key={region.server}
								variant='secondary'
								size='sm'
								style={{
									backgroundColor:
										region === selectedRegion
											? region.color
											: '#464264',
								}}
								className='ms-1 me-1 mt-3 region-button'
								onClick={() => {
									setSelectedRegion(region);
								}}
							>
								{region.name}
							</Button>
						))}
					</div>
				</Container>
			)}
		</Container>
	);
}
export default SummonerApp;
