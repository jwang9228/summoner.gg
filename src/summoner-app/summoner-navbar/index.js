import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHomeSharp, IoMenu } from 'react-icons/io5';
import { BsBarChartFill } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import './nav.css';
import '../../common/colors.css';

function SummonerNav() {
	const links = [
		{ text: 'Home', icon: IoHomeSharp, route: '#', size: 40 },
		{ text: 'Stats', icon: BsBarChartFill, route: 'stats', size: 40 },
		{ text: 'Search', icon: FaSearch, route: 'search', size: 40 },
	];

	const { pathname } = useLocation();

	const getCurrentText = () => {
		const currentLink = links.find((link) => pathname.includes(link.route));
		const currentText = currentLink ? currentLink.text : 'Home';
		return currentText;
	};

	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	return (
		<div>
			<div className='menu-wrapper'>
				<div className='menu-button'>
					<IoMenu size='30' onClick={toggleMenu} />
				</div>
				<span className='current-text'> {getCurrentText()} </span>
			</div>
			<div
				className={`list-group summoner-nav ${
					menuOpen ? 'open' : 'closed'
				}`}
			>
				{links.map((link, index) => {
					return (
						<Link
							key={index}
							to={`/${link.route}`}
							onClick={closeMenu}
							className={`list-group-item ${
								pathname.includes(link.route) && 'active'
							}`}
						>
							<link.icon size={link.size} className='me-3' />
							{link.text}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
export default SummonerNav;
