import React, {useState, useEffect} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {EmailCompose} from './EmailCompose';
import './EmailSideBar.css';
import composeBtn from '../images/compose-btn.png';

export const EmailSideBar = ({openBackdrop, closeBackdrop, isMobile}) => {
  const [isCompose, setIsCompose] = useState(false);
  const navigate = useNavigate();

  const onComposeEmail = () => {
    setIsCompose(!isCompose);
    openBackdrop();
  };

  const closeModal = () => {
    setIsCompose(false);
    closeBackdrop();
    navigate('/email');
  };

  useEffect(() => {

  }, [isMobile]);

  const sideBar = <section className="side-bar">
    <button className="compose" onClick={onComposeEmail}>
      <img src={composeBtn} alt="" />
      <span>Compose</span>
    </button>
    <NavLink className={navData => navData.isActive ? 'active' : ''} end to="/email">Inbox</NavLink>
    <NavLink className={navData => navData.isActive ? 'active' : ''} to="/email/starred">Starred</NavLink>
    <NavLink className={navData => navData.isActive ? 'active' : ''} to="/email/sent">Sent</NavLink>
    <NavLink className={navData => navData.isActive ? 'active' : ''} to="/email/drafts">Drafts</NavLink>
    {isCompose && <EmailCompose isMobile={isMobile} closeModal={closeModal} />}
  </section>;

  const mobileComposeBtn = (
    <>
      <button className="compose compose-mobile" onClick={onComposeEmail}>
        <img src={composeBtn} alt="" />
        <span>Compose</span>
      </button>
      {isCompose && <EmailCompose isMobile={isMobile} closeModal={closeModal} />}
    </>);
  return (
    <>
      {!isMobile && sideBar}
      {isMobile && mobileComposeBtn}
    </>
  );
};

