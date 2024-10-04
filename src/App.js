import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import Teams from './components/Teams'; // Import your Teams component
import Exposures from './components/Exposures'; // Import your Exposures component

function App() {
	return (
		<Router>
			<Navbar />
			<div className='App'>
				<Routes>
					<Route path='/teams' element={<Teams />} />
					<Route path='/exposures' element={<Exposures />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
