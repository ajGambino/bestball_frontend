import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exposures = () => {
	const [players, setPlayers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({
		key: 'exposure',
		direction: 'desc',
	});

	useEffect(() => {
		axios
			.get('http://127.0.0.1:5000/players') // change this to backend URL
			.then((response) => {
				let sortedPlayers = response.data.sort((a, b) => {
					const exposureA = parseFloat(a.exposure.replace('%', ''));
					const exposureB = parseFloat(b.exposure.replace('%', ''));
					return exposureB - exposureA;
				});
				setPlayers(sortedPlayers);
			})
			.catch((error) => {
				console.error('Error fetching player data:', error);
			});
	}, []);

	const sortPlayers = (key) => {
		const newDirection =
			sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

		setSortConfig({
			key,
			direction: newDirection,
		});

		let sortedPlayers = [...players];
		sortedPlayers.sort((a, b) => {
			let aValue, bValue;

			if (key === 'exposure') {
				aValue = parseFloat(a.exposure.replace('%', ''));
				bValue = parseFloat(b.exposure.replace('%', ''));
			} else if (key === 'buyins') {
				aValue = parseFloat(a.buyins.replace('$', ''));
				bValue = parseFloat(b.buyins.replace('$', ''));
			}

			if (newDirection === 'asc') {
				return aValue - bValue;
			} else {
				return bValue - aValue;
			}
		});

		setPlayers(sortedPlayers);
	};

	const filteredPlayers = players.filter((player) =>
		player.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='exposures'>
			<h2>Player Exposures</h2>
			<input
				type='text'
				placeholder='Search players...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginBottom: '10px', padding: '5px' }}
			/>

			<table>
				<thead>
					<tr>
						<th>Player Name</th>
						<th
							onClick={() => sortPlayers('exposure')}
							style={{ cursor: 'pointer' }}
						>
							Exposure (%){' '}
							{sortConfig.key === 'exposure' &&
								(sortConfig.direction === 'asc' ? '↑' : '↓')}
						</th>
						<th
							onClick={() => sortPlayers('buyins')}
							style={{ cursor: 'pointer' }}
						>
							Total Buy-ins{' '}
							{sortConfig.key === 'buyins' &&
								(sortConfig.direction === 'asc' ? '↑' : '↓')}
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredPlayers.map((player, index) => (
						<tr key={index}>
							<td>{player.name}</td>
							<td>{player.exposure}</td>
							<td>{player.buyins}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Exposures;
