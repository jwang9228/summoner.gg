import { useState, useEffect } from 'react';
import * as client from './users/client';
import { ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './home.css';

function MySummoner() {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const fetchAccount = async () => {
			const loggedIn = await client.account();
			setLoggedIn(loggedIn);
		};
		fetchAccount();
	}, []);
	return loggedIn ? (
		<ListGroup>
			<ListGroup.Item className='my-summoner-background d-flex align-items-center m-auto mt-5'>
				<Image
					src={require(`../images/blitz-question.png`)}
					alt='register summoner icon'
					className='register-summoner-icon ms-1 me-2'
					loading='lazy'
				/>
				<span className='register-summoner-label'>
					Search for a summoner and bookmark to register your summoner!
				</span>
			</ListGroup.Item>
		</ListGroup>
	) : (
		<div>
			<ListGroup>
				<ListGroup.Item className='my-summoner-background d-flex align-items-center m-auto mt-5'>
					<Image
						src={require(`../images/blitz-question.png`)}
						alt='register summoner icon'
						className='register-summoner-icon ms-1 me-2'
						loading='lazy'
					/>
					<span className='register-summoner-label'>
						<Link to='./login' style={{'textDecoration': 'none'}}>Login</Link> to register a summoner
						as your own!
					</span>
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
}
export default MySummoner;
