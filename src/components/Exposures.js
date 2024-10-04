import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exposures = () => {
	const [players, setPlayers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortConfig, setSortConfig] = useState({
		key: 'exposure',
		direction: 'desc',
	});
	const [selectedPlayers, setSelectedPlayers] = useState([]);
	const [teams, setTeams] = useState([]);
	const [noTeamsMessage, setNoTeamsMessage] = useState(false);
	const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

	useEffect(() => {
		axios
			.get('https://bestball-api.vercel.app/players') // change this to backend URL
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

	const handleCheckboxChange = (playerName) => {
		setSelectedPlayers((prevSelectedPlayers) => {
			if (prevSelectedPlayers.includes(playerName)) {
				return prevSelectedPlayers.filter((name) => name !== playerName);
			} else {
				return [...prevSelectedPlayers, playerName];
			}
		});
	};

	const clearAllPlayers = () => {
		setSelectedPlayers([]);
		setTeams([]);
		setNoTeamsMessage(false);
	};

	useEffect(() => {
		if (selectedPlayers.length > 0) {
			axios
				.post('http://127.0.0.1:5000/filter-teams', {
					players: selectedPlayers,
				})
				.then((response) => {
					setTeams(response.data);
					setNoTeamsMessage(response.data.length === 0);
					setCurrentTeamIndex(0);
				})
				.catch((error) => {
					console.error('Error fetching filtered teams:', error);
				});
		} else {
			setTeams([]);
			setNoTeamsMessage(false);
		}
	}, [selectedPlayers]);

	const prevTeam = () => {
		setCurrentTeamIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : prevIndex
		);
	};

	const nextTeam = () => {
		setCurrentTeamIndex((prevIndex) =>
			prevIndex < teams.length - 1 ? prevIndex + 1 : prevIndex
		);
	};

	const calculatePositionalBreakdown = (lineup) => {
		const counts = { QB: 0, RB: 0, WR: 0, TE: 0 };

		lineup.forEach((player) => {
			const pos = player.Pos;
			if (counts[pos] !== undefined) {
				counts[pos] += 1;
			}
		});

		return `QB${counts.QB}/RB${counts.RB}/WR${counts.WR}/TE${counts.TE}`;
	};

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

			{noTeamsMessage && (
				<p style={{ color: 'red', marginTop: '20px' }}>
					You have no lineups with that combination of players.
				</p>
			)}

			{teams.length > 0 && (
				<p style={{ marginTop: '20px' }}>
					You have {teams.length} team(s) with the selected player(s).
				</p>
			)}

			{teams.length > 0 && (
				<div className='filtered-teams'>
					<h3>Team {teams[currentTeamIndex].teamNumber}</h3>
					<p>
						Buy-in: {teams[currentTeamIndex].buyIn}
						<br />
						{calculatePositionalBreakdown(teams[currentTeamIndex].lineup)}
					</p>
					<table>
						<thead>
							<tr>
								<th>Position</th>
								<th>Player Name</th>
								<th>Team</th>
							</tr>
						</thead>
						<tbody>
							{teams[currentTeamIndex].lineup.map((player, index) => (
								<tr key={index}>
									<td>{player.Pos}</td>
									<td>{player.Name}</td>
									<td>{player.Team}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div style={{ marginTop: '10px' }}>
						<button onClick={prevTeam} disabled={currentTeamIndex === 0}>
							Previous Team
						</button>
						<button
							onClick={nextTeam}
							disabled={currentTeamIndex === teams.length - 1}
							style={{ marginLeft: '10px' }}
						>
							Next Team
						</button>
					</div>
				</div>
			)}

			<button
				onClick={clearAllPlayers}
				style={{ marginTop: '20px', padding: '5px 10px' }}
			>
				Clear Selected Players
			</button>

			<table style={{ marginTop: '20px' }}>
				<thead>
					<tr>
						<th> </th>
						<th>Name</th>
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
							<td>
								<input
									type='checkbox'
									checked={selectedPlayers.includes(player.name)}
									onChange={() => handleCheckboxChange(player.name)}
								/>
							</td>
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
