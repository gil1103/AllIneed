import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import './MainNav.css';
import logo from '../assets/image/dot_map.png';
import menuBtn from '../assets/image/grid.png';

export const MainNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);


    window.addEventListener("resize", function() {
        if (window.matchMedia('(max-width: 760px)').matches) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    });

    const toggleMenu = () => {
        if (!isMobile) return;
        isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
    };


    useEffect(() => {
    }, [isMobile, isMenuOpen]);

    return (
        <>
            <div className={`overlay ${ isMenuOpen ? ' overlay-shown' : '' }`} onClick={toggleMenu} ></div>
            <nav className="main-header">
                {!isMobile && <div className="left-header">
                    <img className="logo-image" src={logo} alt="logo" />
                    <h1 className="app-title">AllIneed</h1>
                </div>}
                {isMobile && <img className="logo-image" src={logo} alt="logo" />}
                {isMobile && <h1 className="app-title">AllIneed</h1>}
                <ul className={`nav-list ${ isMenuOpen ? ' nav-list-open' : '' }`}>
                    <li onClick={toggleMenu}><NavLink className={navData => navData.isActive ? 'active' : ''} to='/homepage'>Home</NavLink></li>
                    <li onClick={toggleMenu}><NavLink className={navData => navData.isActive ? 'active' : ''} to='/about'>About</NavLink></li>
                    <li onClick={toggleMenu}><NavLink className={navData => navData.isActive ? 'active' : ''} to='/email'>Email</NavLink></li>
                    <li onClick={toggleMenu}><NavLink className={navData => navData.isActive ? 'active' : ''} to='/keep'>Notes</NavLink></li>
                    <li onClick={toggleMenu}><NavLink className={navData => navData.isActive ? 'active' : ''} to='/book'>Books</NavLink></li >
                </ul>
                {isMobile && <button className='menu-btn' onClick={toggleMenu}>
                    <img src={menuBtn} alt="" />
                </button>}
            </nav>
        </>

    );
};
