import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Teams from './components/Teams';
import Exposures from './components/Exposures';

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
