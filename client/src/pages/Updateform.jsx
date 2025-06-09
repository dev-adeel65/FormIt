import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Createform.css';

function Updateform() {
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
		isPublic: false,
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
				const response = await axios.get(`/api/forms/f/${formId}`, {
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				});
				if (response.status === 200) {
					const { formId, title, layout } = response.data;
					setFormLayout({
						formId: formId,
						title: title,
						sections: layout,
						isPublic: response.data.public || false,
						// layout.map((section) => ({
						// ...section,
						// id: uuidv4(), // Ensure each section has a unique ID
						// })),
					});
				} else {
					alert('Failed to fetch form layout. Please try again.');
				}
			} catch (error) {
				console.error('Error fetching form layout:', error);
				alert('An error occurred while fetching the form layout.');
			}
		}
		fetchFormLayout();
	}, []);

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormLayout((prevLayout) => ({
			...prevLayout,
			[name]: value,
		}));
	};

	const formLayoutUpdate = async () => {
		const formId =
			formLayout.formId || window.location.pathname.split('/').pop();
		try {
			const response = await axios.patch(
				`/api/forms/update`,
				{
					formId: formId,
					title: formLayout.title,
					layout: formLayout.sections,
				},
				{
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				}
			);
			if (response.status === 200) {
				alert('Form updated successfully!');
				navigate('/my-forms');
			} else {
				alert('Failed to update form. Please try again.');
			}
		} catch (error) {
			console.error('Error updating form:', error);
			alert('An error occurred while updating the form.');
		}
	};
	const formPublic = async () => {
		const formId =
			formLayout.formId || window.location.pathname.split('/').pop();
		try {
			const response = await axios.patch(
				`/api/forms/update`,
				{
					formId: formId,
					public: !formLayout.isPublic,
				},
				{
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				}
			);
			if (response.status === 200) {
				setFormLayout((prevLayout) => ({
					...prevLayout,
					isPublic: !prevLayout.isPublic,
				}));
				alert(
					`Form visibility updated to ${
						!formLayout.isPublic ? 'public' : 'private'
					}`
				);
			} else {
				alert('Failed to update form visibility. Please try again.');
			}
		} catch (error) {
			console.error('Error updating form visibility:', error);
			alert('An error occurred while updating the form visibility.');
		}
	};
	const formShare = async () => {
		const formId =
			formLayout.formId || window.location.pathname.split('/').pop();
		try {
			const response = await axios.get(`/api/forms/f/${formId}`, {
				headers: {
					'x-auth-token': localStorage.getItem('token'),
				},
			});
			if (response.status === 200) {
				if (response.data.public) {
					const formLink = `${window.location.origin}/forms/s/${formId}`;

					navigator.clipboard.writeText(formLink);

					alert('Form link copied to clipboard!');
				} else {
					alert(
						'Form is not public. Please make it public to share.'
					);
				}
			} else {
				alert('Failed to fetch form link. Please try again.');
			}
		} catch (error) {
			console.error('Error fetching form link:', error);
			alert('An error occurred while fetching the form link.');
		}
	};
	const formDelete = async () => {
		const formId = window.location.pathname.split('/').pop();
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this form? This action cannot be undone.'
		);
		if (!confirmDelete) return;
		try {
			const response = await axios.delete(`/api/forms/d/${formId}`, {
				headers: {
					'x-auth-token': localStorage.getItem('token'),
				},
			});
			if (response.status === 200) {
				alert('Form deleted successfully!');
				navigate('/my-forms');
			} else {
				alert('Failed to delete form. Please try again.');
			}
		} catch (error) {
			console.error('Error deleting form:', error);
			alert('An error occurred while deleting the form.');
		}
	};

	return (
		<>
			<Header btn={headerBtn} />
			<div className='create-form'>
				<input
					type='text'
					className='title-field font-rob-r'
					placeholder='Form Title'
					value={formLayout.title}
					onChange={onChange}
					name='title'
				/>
				<div className='form'>
					{formLayout.sections.map((section, index) => (
						<div className='section' key={section.id}>
							<div className='head'>
								<input
									type='text'
									value={section.sectionTitle}
									onChange={(e) => {
										const updatedSections = [
											...formLayout.sections,
										];
										updatedSections[index].sectionTitle =
											e.target.value;
										setFormLayout((prevLayout) => ({
											...prevLayout,
											sections: updatedSections,
										}));
									}}
								/>
							</div>
							{section.fields.map((field, fieldIndex) => (
								<div className='field' key={field.id}>
									<div className='row1'>
										<input
											className='font-ab-b'
											type='text'
											value={field.fieldName}
											onChange={(e) => {
												const updatedSections = [
													...formLayout.sections,
												];
												updatedSections[index].fields[
													fieldIndex
												].fieldName = e.target.value;
												setFormLayout((prevLayout) => ({
													...prevLayout,
													sections: updatedSections,
												}));
											}}
										/>
										<div>
											<select
												name='type'
												value={field.fieldType}
												onChange={(e) => {
													const updatedSections = [
														...formLayout.sections,
													];
													updatedSections[
														index
													].fields[
														fieldIndex
													].fieldType =
														e.target.value;
													setFormLayout(
														(prevLayout) => ({
															...prevLayout,
															sections:
																updatedSections,
														})
													);
												}}
											>
												<option value='text'>
													Text Field
												</option>
												<option value='number'>
													Number Field
												</option>
											</select>
											<span
												onClick={() => {
													const updatedSections = [
														...formLayout.sections,
													];
													updatedSections[
														index
													].fields.splice(
														fieldIndex,
														1
													);
													setFormLayout(
														(prevLayout) => ({
															...prevLayout,
															sections:
																updatedSections,
														})
													);
												}}
											>
												x
											</span>
										</div>
									</div>
									<div className='row2'>
										<input type='text' />
									</div>
								</div>
							))}
							<input
								type='button'
								className='add-field-btn'
								value={'Add Field'}
								name='add-field'
								onClick={() => {
									const newField = {
										id: uuidv4(),
										fieldName: 'New Field',
										fieldType: 'text',
										value: '',
									};
									setFormLayout((prevLayout) => {
										const updatedSections = [
											...prevLayout.sections,
										];
										updatedSections[index].fields.push(
											newField
										);
										return {
											...prevLayout,
											sections: updatedSections,
										};
									});
								}}
							/>
							<input
								type='button'
								className='delete-section-btn'
								value={'Delete Section'}
								name='delete-section'
								onClick={() => {
									const updatedSections = [
										...formLayout.sections,
									];
									updatedSections.splice(index, 1);
									setFormLayout((prevLayout) => ({
										...prevLayout,
										sections: updatedSections,
									}));
								}}
							/>
						</div>
					))}
					<input
						type='button'
						value={'Add section'}
						className='add-section-btn'
						onClick={() => {
							const newSection = {
								id: uuidv4(),
								sectionTitle: 'New Section',
								fields: [],
							};
							setFormLayout((prevLayout) => ({
								...prevLayout,
								sections: [...prevLayout.sections, newSection],
							}));
						}}
					/>
				</div>
				<input
					type='button'
					value={'update'}
					onClick={formLayoutUpdate}
					className='update-form-btn font-ab-b'
				/>
				<div className='share-public'>
					<input
						type='button'
						value={
							formLayout.isPublic
								? 'Make it private'
								: 'Make it public'
						}
						onClick={formPublic}
						className='public-form-btn font-ab-b'
					/>
					<input
						type='button'
						value={'share'}
						onClick={formShare}
						className='share-form-btn font-ab-b'
					/>
				</div>
				<input
					type='button'
					value={'delete'}
					onClick={formDelete}
					className='delete-form-btn font-ab-b'
				/>
				<Link
					className='responses-form-btn'
					to={`/responses/r/${window.location.pathname
						.split('/')
						.pop()}`}
				>
					View Responses
				</Link>
			</div>
		</>
	);
}

export default Updateform;
