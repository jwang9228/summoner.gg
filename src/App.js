// App.jsx or your main component file
import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import SummonerApp from './summoner-app';
import './common/colors.css';

function App() {
	useEffect(() => {
		document.body.classList.add('app-background-color');
		return () => {
			document.body.classList.remove('app-background-color');
		};
	}, []);
	return (
		<HashRouter>
			<div>
				<Routes>
					<Route path='/' element={<SummonerApp />} />
				</Routes>
			</div>
		</HashRouter>
	);
}
export default App;
