import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as client from './client.js';

function Summoner() {
	const { server, summonerName } = useParams();
	const [summonerData, setSummonerData] = useState();
	useEffect(() => {
		// TODO: first check the database. if there is already an entry, don't get data. else call and make entry in db.
        client.getSummonerData(server, summonerName).then((response) => {
			response && setSummonerData(response.data);
		});
    }, [server, summonerName]);
	return (
		summonerData && 
		<div>
			<h3 style={{ color: '#FFFFFF' }}>{summonerData.puuid}</h3>
			<h3 style={{ color: '#FFFFFF' }}>{summonerData.name}</h3>
			<h3 style={{ color: '#FFFFFF' }}>{summonerData.summonerLevel}</h3>
		</div>
	);
}
export default Summoner;
