import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Myforms from './pages/Myforms.jsx';
import Createform from './pages/Createform.jsx';
import Updateform from './pages/Updateform.jsx';
import SubmitForm from './pages/SubmitForm.jsx';
import Mysubmissions from './pages/Mysubmissions.jsx';
import Viewsubmission from './pages/Viewsubmission.jsx';
import Viewresponses from './pages/Viewresponses.jsx';
import Profile from './pages/Profile.jsx';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Homepage />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/login' element={<Login />} />

				<Route path='/my-forms' element={<Myforms />} />
				<Route path='/create-form' element={<Createform />} />
				<Route path='/forms/f/:id' element={<Updateform />} />
				<Route path='/forms/s/:id' element={<SubmitForm />} />
				<Route path='/my-submissions' element={<Mysubmissions />} />
				<Route path='/responses/s/:id' element={<Viewsubmission />} />
				<Route path='/responses/r/:id' element={<Viewresponses />} />
				<Route path='/profile' element={<Profile />} />

				{/* Catch-all route for undefined paths */}

				<Route path='*' element={<Homepage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
