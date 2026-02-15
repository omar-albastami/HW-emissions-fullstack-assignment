import React from 'react';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className='App'>
		<nav className='navbar navbar-dark bg-dark'>
			<div className='container-fluid'>
				<span className='navbar-brand mb-0 h1'>
					Highwood Emissions Management
				</span>
			</div>
			<span className='badge bg-success'>System Online</span>
		</nav>
		<Dashboard />
    </div>
  )
};

export default App;
