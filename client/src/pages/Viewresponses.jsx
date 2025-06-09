import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Viewresponses.css';

function Viewresponses() {
	const [headerBtn, setHeaderBtn] = useState({});
	const navigate = useNavigate();
	const [responses, setResponses] = useState([
		{
			_id: '',
			user: {
				_id: '',
				email: '',
			},
			form: {
				_id: '',
				title: '',
			},
			response: [
				{
					sectionTitle: '',
					fields: [
						{
							fieldName: '',
							value: '',
						},
						{
							fieldName: '',
							value: '',
						},
					],
				},
			],
			date: '',
		},
	]);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			navigate('/login');
		}

		const fetchResponses = async () => {
			const formId = window.location.pathname.split('/').pop();
			try {
				const response = await axios.get(`/api/responses/r/${formId}`, {
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				});

				if (response.status === 200 && response.data.length > 0) {
					setResponses(response.data);
					console.log(
						'Responses fetched successfully:',
						response.data
					);
				}
			} catch (error) {
				console.error('Error fetching responses:', error);
			}
		};

		fetchResponses();
	}, []);
	return (
		<>
			<Header btn={headerBtn} />
			<div className='view-responses'>
				<div className='head'>
					<h2>{responses[0].form.title}</h2>
				</div>
				<div className='content'>
					{responses.map((response) => (
						<div className='response'>
							<div className='head'>
								<h3>by : {response.user.email}</h3>
							</div>
							<div className='body'>
								{response.response.map((section, index) => (
									<div key={index} className='section'>
										{section.fields.map(
											(field, fieldIndex) => (
												<div
													key={fieldIndex}
													className='row font-rob-b'
												>
													{field.fieldName}:{' '}
													{field.value}
												</div>
											)
										)}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default Viewresponses;
