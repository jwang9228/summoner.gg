import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import SummonerApp from './summoner-app';
import SummonerNav from './summoner-app/summoner-navbar';
import Summoner from './summoner';
import Login from './summoner-app/login';
import Register from './summoner-app/login/register.js';
import './common/content.css';
import './common/colors.css';

function App() {
	useEffect(() => {
		document.body.classList.add('app-background-color');
		return () => {
			document.body.classList.remove('app-background-color');
		};
	}, []);
	return (
		<BrowserRouter>
			<div className='d-flex'>
				<SummonerNav />
				<div className='page-content'>
					<Routes>
						<Route path='/' element={<SummonerApp />} />
						<Route
							path='/results/:server/:summonerName'
							element={<Summoner />}
						/>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}
export default App;
