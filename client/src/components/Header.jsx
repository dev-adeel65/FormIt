import { Link } from 'react-router-dom';

function Header(props) {
	return (
		<header className='header font-ab-b'>
			<h1>
				<Link to={'/'}>FormIt</Link>
			</h1>
			<Link to={props.btn.btnLink} className='head-btn font-ab-b'>
				{props.btn.btnText}
			</Link>
		</header>
	);
}

export default Header;
