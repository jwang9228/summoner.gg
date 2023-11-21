import './home.css';
import '../common/colors.css';
import regions from './regions.json';
import React from 'react';
import { Form, Button, InputGroup, Container } from 'react-bootstrap';
import { CgSearch } from 'react-icons/cg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SummonerApp() {
	const navigate = useNavigate();
	const [summonerName, setSummonerName] = useState('');
	const [selectedRegion, setSelectedRegion] = useState(regions[0]);
	const [showRegions, setShowRegions] = useState(false);
	return (
		<Container>
			<Button className='btn float-end'>Login</Button>
			<p className='app-title mb-3 mt-3'>
				SUMMONER
				<span className='app-blue-accent'>.</span>
				GG
			</p>
			<InputGroup className='m-auto w-50' size='lg'>
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
					onChange={(e) => {
						setSummonerName(e.target.value);
					}}
					onKeyUp={(e) => {
						if (e.key === 'Enter') {
							navigate(
								`/results/${selectedRegion.server}/${summonerName}`
							);
						}
					}}
				/>
				<InputGroup.Text className='white-background'>
					<Button className='white-background search-button'>
						<CgSearch className='search-icon' size={24} />
					</Button>
				</InputGroup.Text>
			</InputGroup>
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
