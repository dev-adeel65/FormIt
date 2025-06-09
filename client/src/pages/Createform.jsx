import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import './Createform.css';

function Createform() {
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
	}, []);

	const onChange = (e) => {
		const { name, value } = e.target;
		setFormLayout((prevLayout) => ({
			...prevLayout,
			[name]: value,
		}));
	};

	const formLayoutSubmit = async () => {
		if (formLayout.title.trim() === '') {
			alert('Please enter a title for the form');
			return;
		}
		if (formLayout.sections.length === 0) {
			alert('Please add at least one section to the form');
			return;
		}
		for (const section of formLayout.sections) {
			if (section.fields.length === 0) {
				alert('Please add at least one field to each section');
				return;
			}
			for (const field of section.fields) {
				if (field.fieldName.trim() === '') {
					alert('Please enter a name for each field');
					return;
				}
			}
		}

		const formLayoutToSubmit = {
			title: formLayout.title,
			layout: formLayout.sections,
		};

		try {
			const response = await axios.post(
				'/api/forms/create',
				formLayoutToSubmit,
				{
					headers: {
						'x-auth-token': localStorage.getItem('token'),
					},
				}
			);
			if (response.status === 201) {
				alert('Form layout submitted successfully!');
				navigate('/my-forms');
			} else {
				alert('Failed to submit form layout. Please try again.');
			}
		} catch (error) {
			console.error('Error submitting form layout:', error);
			alert('An error occurred while submitting the form layout.');
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
					value={'Create'}
					onClick={formLayoutSubmit}
					className='create-form-btn font-ab-b'
				/>
			</div>
		</>
	);
}

export default Createform;
