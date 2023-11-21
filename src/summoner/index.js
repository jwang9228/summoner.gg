import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import * as client from './client.js';

function Summoner() {
	const { server, summonerName } = useParams();
	useEffect(() => {
        client.getSummonerData(server, summonerName).then((response) => {
			// TODO: handle error (response will be undefined), redux/database to store, 
			// only getSummonerData if update called by user or if database is empty for that summoner (no api calls ever made)
			// * this is to prevent multiple api calls to getSummonerData
			console.log(response);
		});
    }, [server, summonerName]);
	return (
		<div>
			<h1 style={{ color: '#FFFFFF' }}>test</h1>
		</div>
	);
}
export default Summoner;
