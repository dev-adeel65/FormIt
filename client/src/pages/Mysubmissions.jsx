import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Myforms.css';

function Mysubmissions() {
	const [headerBtn, setHeaderBtn] = useState({});
	const navigate = useNavigate();
	const [submissions, setSubmissions] = useState([]);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			navigate('/login');
		}

		async function fetchSubmissions() {
			try {
				const response = await axios.get(
					'/api/responses/my-submissions',
					{
						headers: {
							'x-auth-token': localStorage.getItem('token'),
						},
					}
				);
				if (response.status === 200) {
					setSubmissions(response.data);
				} else {
					console.error(
						'Failed to fetch submissions:',
						response.statusText
					);
				}
			} catch (error) {
				console.error('Error fetching submissions:', error);
			}
		}
		fetchSubmissions();
	}, []);
	return (
		<>
			<Header btn={headerBtn} />
			<div className='my-forms'>
				<div className='head'>
					<Link to='/my-forms' className='item'>
						My Forms
					</Link>
					<Link to='/my-submissions' className='item active'>
						My Submissions
					</Link>
				</div>
				<div className='body'>
					<div className='form-list'>
						{submissions.length === 0 && (
							<>
								<p className='no-forms'>
									You have no Submissions yet.
									<br />
								</p>
							</>
						)}
						{submissions.map((submission) => {
							return (
								<div
									className='form-item'
									key={submission._id || submission.id}
									onClick={() =>
										navigate(
											`/responses/s/${
												submission._id || submission.id
											}`
										)
									}
								>
									<h2>{submission.form.title}</h2>
									<span className='font-ab-r'>
										Date Submitted :{' '}
										{new Date(
											submission.date
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

export default Mysubmissions;
