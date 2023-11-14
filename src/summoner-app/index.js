import './home.css';
import '../common/colors.css';
import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { CgSearch } from 'react-icons/cg';

function SummonerApp() {
	return (
		<div>
			<p className='app-title mb-3 mt-3'>
				SUMMONER
				<span className='app-blue-accent'>.</span>
				GG
			</p>
			<InputGroup className='m-auto w-50' size='lg'>
                <InputGroup.Text className='white-background'>
                    <Button className='region-button app-blue-accent' size='sm'>
                        NA
                    </Button>
                </InputGroup.Text>
				<Form.Control
                    placeholder='Search for Summoner'
                    className='border-0 search-bar'
				/>
                <InputGroup.Text className='white-background'>
                    <Button className='white-background search-button'>
                        <CgSearch className='search-icon' size={24}/>
                    </Button>
                </InputGroup.Text>
			</InputGroup>
		</div>
	);
}
export default SummonerApp;
