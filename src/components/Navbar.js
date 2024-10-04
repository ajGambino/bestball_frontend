import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav style={styles.nav}>
			<ul style={styles.ul}>
				<li style={styles.li}>
					<Link to='/teams' style={styles.link}>
						Teams
					</Link>
				</li>
				<li style={styles.li}>
					<Link to='/exposures' style={styles.link}>
						Exposures
					</Link>
				</li>
			</ul>
		</nav>
	);
};

// Inline styles for the Navbar
const styles = {
	nav: {
		backgroundColor: '#333',
		padding: '10px',
		textAlign: 'center',
	},
	ul: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		display: 'inline-block',
	},
	li: {
		display: 'inline',
		margin: '0 15px',
	},
	link: {
		color: '#fff',
		textDecoration: 'none',
		fontSize: '18px',
	},
};

export default Navbar;
