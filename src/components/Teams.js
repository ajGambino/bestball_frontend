import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teams = () => {
	const [team, setTeam] = useState(null);
	const [teamNumber, setTeamNumber] = useState(1);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const teamsPerPage = 12;

	useEffect(() => {
		setLoading(true);
		axios
			.get(`http://127.0.0.1:5000/lineups/${teamNumber}`) // change to  backend URL
			.then((response) => {
				setTeam(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching team lineup:', error);
				setLoading(false);
			});
	}, [teamNumber]);

	const prevTeam = () => {
		if (teamNumber > 1) {
			setTeamNumber(teamNumber - 1);
		}
	};

	const nextTeam = () => {
		setTeamNumber(teamNumber + 1);
	};

	const jumpToTeam = (teamNum) => {
		setTeamNumber(teamNum);
	};

	const nextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const startTeam = (currentPage - 1) * teamsPerPage + 1;
	const endTeam = startTeam + teamsPerPage - 1;

	const sortLineup = (lineup) => {
		const positionOrder = {
			QB: 1,
			RB: 2,
			WR: 3,
			TE: 4,
		};

		return lineup.sort((a, b) => {
			const posA = positionOrder[a.Pos] || 99;
			const posB = positionOrder[b.Pos] || 99;
			return posA - posB;
		});
	};

	const countPositions = (lineup) => {
		const positionCounts = {
			QB: 0,
			RB: 0,
			WR: 0,
			TE: 0,
		};

		lineup.forEach((player) => {
			if (positionCounts[player.Pos] !== undefined) {
				positionCounts[player.Pos] += 1;
			}
		});

		return positionCounts;
	};

	if (loading) {
		return <div>Loading team...</div>;
	}

	if (!team) {
		return <div>No team data available.</div>;
	}

	const sortedLineup = sortLineup(team.lineup);

	const positionCounts = countPositions(sortedLineup);

	return (
		<div className='team'>
			<h2>Team {team.teamNumber}</h2>
			<p>Buy-in: {team.buyIn}</p>
			<p>
				QB{positionCounts.QB}/RB{positionCounts.RB}/WR{positionCounts.WR}/TE
				{positionCounts.TE}
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
					{sortedLineup.map((player, index) => (
						<tr key={index}>
							<td>{player.Pos}</td>
							<td>{player.Name}</td>
							<td>{player.Team}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div style={{ marginTop: '20px' }}>
				<button onClick={prevTeam} disabled={teamNumber === 1}>
					Previous Team
				</button>
				<button onClick={nextTeam}>Next Team</button>
			</div>

			<div style={{ marginTop: '20px' }}>
				<button onClick={prevPage} disabled={currentPage === 1}>
					&lt;&lt; Previous 12
				</button>

				{Array.from({ length: teamsPerPage }, (_, index) => {
					const teamNum = startTeam + index;
					return (
						teamNum <= 48 && (
							<button
								key={teamNum}
								onClick={() => jumpToTeam(teamNum)}
								style={{
									fontWeight: teamNum === teamNumber ? 'bold' : 'normal',
									margin: '0 5px',
								}}
							>
								{teamNum}
							</button>
						)
					);
				})}

				<button onClick={nextPage} disabled={endTeam >= 48}>
					Next 12 &gt;&gt;
				</button>
			</div>
		</div>
	);
};

export default Teams;
