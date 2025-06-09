import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import Header from '../components/Header.jsx';

function Profile() {
	const [headerBtn, setHeaderBtn] = useState({});
	const [passwords, setPasswords] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const navigate = useNavigate();

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

	const changePassword = async (e) => {
		e.preventDefault();
		if (passwords.newPassword !== passwords.confirmNewPassword) {
			alert('New password and confirm password do not match.');
			return;
		}
		if (passwords.currentPassword === passwords.newPassword) {
			alert('New password cannot be the same as current password.');
			return;
		}
		try {
			const response = await axios.patch(
				'/api/users/change-password',
				{
					password: passwords.currentPassword,
					newPassword: passwords.newPassword,
				},
				{
					headers: {
						'x-auth-token': localStorage.getItem('token') || '',
					},
				}
			);

			if (response.status === 200) {
				alert('Password changed successfully!');
				localStorage.removeItem('token');
				localStorage.removeItem('userName');
				navigate('/login');
			}
		} catch (error) {
			console.error('Error changing password:', error);
			alert(
				'An error occurred while changing the password. Please try again.'
			);
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userName');
		navigate('/login');
	};

	return (
		<>
			<Header btn={headerBtn} />
			<div className='profile'>
				<form className='form' action='#'>
					<div className='head'>
						<h3>password</h3>
					</div>
					<div className='body'>
						<div className='field'>
							<label htmlFor='current-password'>
								Current password
							</label>
							<input
								className='font-rob-r'
								type='password'
								id='current-password'
								name='current-password'
								required
								value={passwords.currentPassword}
								onChange={(e) =>
									setPasswords({
										...passwords,
										currentPassword: e.target.value,
									})
								}
							/>
						</div>
						<div className='field'>
							<label htmlFor='new-password'>new password</label>
							<input
								className='font-rob-r'
								type='password'
								id='new-password'
								name='new-password'
								required
								value={passwords.newPassword}
								onChange={(e) =>
									setPasswords({
										...passwords,
										newPassword: e.target.value,
									})
								}
							/>
						</div>
						<div className='field'>
							<label htmlFor='confirm-new-password'>
								confirm new password
							</label>
							<input
								className='font-rob-r'
								type='password'
								id='confirm-new-password'
								name='confirm-new-password'
								required
								value={passwords.confirmNewPassword}
								onChange={(e) =>
									setPasswords({
										...passwords,
										confirmNewPassword: e.target.value,
									})
								}
							/>
						</div>
						<input
							className='font-ab-b'
							type='submit'
							name='submit'
							id=''
							value={'change password'}
							onClick={changePassword}
						/>
					</div>
				</form>
				<input
					type='button'
					className='font-ab-b'
					value='logout'
					onClick={logout}
				/>
			</div>
		</>
	);
}

export default Profile;
