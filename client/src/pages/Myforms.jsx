import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Myforms.css';

function Myforms() {
	const [headerBtn, setHeaderBtn] = useState({});
	const navigate = useNavigate();
	const [forms, setForms] = useState([]);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			navigate('/login');
		}

		async function fetchForms() {
			try {
				const response = await axios.get('/api/forms/my-forms', {
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				});
				setForms(response.data);
			} catch (error) {
				console.error('Error fetching forms:', error);
			}
		}
		fetchForms();
	}, []);
	return (
		<>
			<Header btn={headerBtn} />
			<div className='my-forms'>
				<div className='head'>
					<Link to='/my-forms' className='item active'>
						My Forms
					</Link>
					<Link to='/my-submissions' className='item'>
						My Submissions
					</Link>
				</div>
				<div className='body'>
					<Link className='create-new-form' to='/create-form'>
						+
					</Link>
					<div className='form-list'>
						{forms.length === 0 && (
							<>
								<p className='no-forms'>
									You have no forms yet.
									<br />
									Create your first form by clicking the '+'
									button above.
								</p>
							</>
						)}
						{forms.map((form) => {
							return (
								<div
									className='form-item'
									key={form._id || form.id}
									onClick={() =>
										navigate(
											`/forms/f/${form._id || form.id}`
										)
									}
								>
									<h2>{form.title}</h2>
									<span className='font-ab-r'>
										Date{' '}
										{form.modified ? 'Modified' : 'Created'}
										:{' '}
										{new Date(
											form.date
										).toLocaleDateString()}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

export default Myforms;
