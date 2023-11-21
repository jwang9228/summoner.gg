// App.jsx or your main component file
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import SummonerApp from './summoner-app';
import Summoner from './summoner';
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
			<div>
				<Routes>
					<Route path='/' element={<SummonerApp />} />
					<Route
						path='/results/:server/:summonerName'
						element={<Summoner />}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	);
}
export default App;
