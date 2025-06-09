import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Myforms.css';

function Viewsubmission() {
	const [headerBtn, setHeaderBtn] = useState({});
	const navigate = useNavigate();
	const [submissionData, setSubmissionData] = useState({
		form: {
			title: 'Loading...',
		},
		response: [
			{
				fields: [],
			},
		],
	});

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			navigate('/login');
		}

		const fetchSubmissionData = async () => {
			const submissionId = window.location.pathname.split('/').pop();
			try {
				const response = await axios.get(
					`/api/responses/s/${submissionId}`,
					{
						headers: {
							'x-auth-token': localStorage.getItem('token'),
						},
					}
				);
				if (response.status === 200) {
					setSubmissionData(response.data);
					console.log(response.data);
				} else {
					console.error('Failed to fetch submission data');
				}
			} catch (error) {
				console.error('Error fetching submission data:', error);
			}
		};

		fetchSubmissionData();
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
				<div className='submission-body'>
					<div className='submission'>
						<div className='head'>
							<h2>{submissionData.form.title}</h2>
						</div>
						<div className='content'>
							{submissionData.response[0].fields.map((field) => (
								<div className='row' key={field.fieldName}>
									<h3>
										{field.fieldName}
										{' :-'}&nbsp;
									</h3>
									<p className='font-rob-r'>{field.value}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Viewsubmission;
