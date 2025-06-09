import React, { useState, useEffect } from 'react';
// import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Header from '../components/Header.jsx';

function Signup() {
	let [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
	});

	const navigate = useNavigate();

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		const formDataCopy = {
			name: formData.fullName,
			email: formData.email,
			password: formData.password,
		};

		try {
			const response = await axios.post(
				'/api/users/register',
				formDataCopy
			);
			if (response.status === 201) {
				console.log('Signup successful:', response.data);
				navigate('/login');
			}
		} catch (error) {
			if (error.response.status === 400) {
				let errorMessage = '';
				error.response.data.errors.forEach((err) => {
					errorMessage += `\n${err.msg} `;
				});
				alert(`Error: ${errorMessage}`);
			} else {
				console.error('Signup error:', error);
				alert('An unexpected error occurred. Please try again later.');
			}
		}
	};

	const [headerBtn, setHeaderBtn] = useState({});

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			setHeaderBtn({
				btnText: 'Login',
				btnLink: '/login',
			});
		}
	}, []);

	return (
		<>
			<Header btn={headerBtn} />
			<div className='signup'>
				<div className='box'>
					<div className='head'>
						<h2 className='font-ab-b'>Create an account</h2>
					</div>
					<form className='form' onSubmit={onSubmit}>
						<div className='input-box'>
							<label htmlFor='fullName'>Full Name</label>
							<input
								type='text'
								id='fullName'
								name='fullName'
								value={formData.fullName}
								onChange={onChange}
								required
							/>
						</div>
						<div className='input-box'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={onChange}
								required
							/>
						</div>
						<div className='input-box'>
							<label htmlFor='password'>Password</label>
							<input
								type='password'
								id='password'
								name='password'
								value={formData.password}
								onChange={onChange}
								required
							/>
						</div>
						<input
							type='submit'
							className='btn font-ab-b'
							value='submit'
						/>
					</form>
				</div>
			</div>
		</>
	);
}

export default Signup;
