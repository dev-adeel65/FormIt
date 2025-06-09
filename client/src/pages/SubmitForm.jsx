import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Createform.css';

function SubmitForm() {
	const [formLayout, setFormLayout] = useState({
		title: '',
		sections: [
			{
				id: uuidv4(),
				sectionTitle: 'Section1',
				fields: [
					{
						id: uuidv4(),
						fieldName: 'First Name',
						fieldType: 'text',
						value: '',
					},
				],
			},
		],
	});
	const [headerBtn, setHeaderBtn] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('token')) {
			setHeaderBtn({
				btnText: localStorage.getItem('userName'),
				btnLink: '/profile',
			});
		} else {
			navigate('/login');
		}

		async function fetchFormLayout() {
			const formId = window.location.pathname.split('/').pop();
			try {
				const response = await axios.get(`/api/forms/s/${formId}`);
				if (response.status === 200) {
					const { formId, title, layout } = response.data;
					setFormLayout({
						formId: formId,
						title: title,
						sections: layout,
					});
				}
			} catch (error) {
				console.error('Error fetching form layout:', error);
				navigate('/my-forms');
			}
		}
		fetchFormLayout();
	}, []);

	const formSubmit = async () => {
		const formId =
			formLayout.formId || window.location.pathname.split('/').pop();
		const responseData = {
			formId: formId,
			response: formLayout.sections.map((section) => ({
				sectionTitle: section.sectionTitle,
				fields: section.fields.map((field) => ({
					fieldName: field.fieldName,
					value: field.value,
				})),
			})),
		};

		try {
			const response = await axios.post(
				'/api/responses/submit',
				responseData,
				{
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				}
			);
			if (response.status === 200) {
				alert('Response submitted successfully');
				navigate('/my-submissions');
			}
		} catch (error) {
			console.error('Error submitting response:', error);
			alert('Failed to submit response. Please try again.');
		}
	};
	return (
		<>
			<Header btn={headerBtn} />
			<div className='create-form submit-form'>
				<input
					type='text'
					className='title-field font-rob-r'
					placeholder='Form Title'
					value={formLayout.title}
					name='title'
					readOnly
				/>
				<div className='form'>
					{formLayout.sections.map((section, index) => (
						<div className='section' key={section.id}>
							<div className='head'>
								<input
									type='text'
									value={section.sectionTitle}
									readOnly
								/>
							</div>
							{section.fields.map((field, fieldIndex) => (
								<div className='field' key={field.id}>
									<div className='row1'>
										<input
											className='font-ab-b'
											type='text'
											value={field.fieldName}
											readOnly
										/>
									</div>
									<div className='row2'>
										<input
											type={field.fieldType}
											value={field.value}
											onChange={(e) => {
												const newSections = [
													...formLayout.sections,
												];
												newSections[index].fields[
													fieldIndex
												].value = e.target.value;
												setFormLayout({
													...formLayout,
													sections: newSections,
												});
											}}
										/>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
				<input
					type='button'
					value={'submit'}
					onClick={formSubmit}
					className='submit-form-btn font-ab-b'
				/>
			</div>
		</>
	);
}

export default SubmitForm;
