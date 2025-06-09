import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import Header from '../components/Header.jsx';

function Homepage() {
	const [headerBtn, setHeaderBtn] = useState({});

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			setHeaderBtn({
				btnText: 'Register',
				btnLink: '/signup',
			});
		}
	}, []);

	return (
		<>
			<Header btn={headerBtn} />
			<div className='homepage'>
				<h2 className='font-ab-r'>
					Information sharing made easy <br /> just form it.
				</h2>
				<Link to='/my-forms' className='btn'>
					get started
				</Link>
			</div>
		</>
	);
}

export default Homepage;
