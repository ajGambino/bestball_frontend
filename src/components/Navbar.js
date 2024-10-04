import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className='navbar'>
			<ul className='navbar-list'>
				<li className='navbar-item'>
					<Link to='/teams' className='navbar-link'>
						All Teams
					</Link>
				</li>
				<li className='navbar-item'>
					<Link to='/' className='navbar-link'>
						Exposures
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
