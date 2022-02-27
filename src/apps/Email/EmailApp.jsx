import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {EmailList} from './cmps/EmailList';
import {EmailSideBar} from './cmps/EmailSideBar';
import {EmailSort} from './cmps/EmailSort';
import {Filter} from '../../cmps/Filter';
import {emailService} from './services/emailService';
import {eventBusService} from '../../services/eventBusService';
import {Backdrop} from '../../cmps/Backdrop';
import {EmailMobileMenu} from './cmps/EmailMobileMenu.js';
import {useWindowSize} from "../../services/useWindowSize";
import './EmailApp.css';

export const EmailApp = () => {
    const [emailsData, setEmailsData] = useState([]);
    const [sortBy, setSortBy] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [isFiltered, setIsFilter] = useState(false);
    const [show, setShow] = useState(false);
    const size = useWindowSize();
    const isMobile = size.width < 800 ? true : false;
    let location = useLocation();

    useEffect(() => {
        const fetchEmails = async () => {
            const emailsToShow = location.pathname.split('/')[2];
            const emails = await emailService.query(emailsToShow);
            setEmailsData(emails);
        };
        fetchEmails();
        // const handleGotNewEmail = (email) => {
        //     console.log(email);
        //     setEmailsData([email, ...emailsData]);
        // };
        // eventBusService.on('gotNewEmail', handleGotNewEmail);
        // return () => {
        //     window.removeEventListener('gotNewEmail', handleGotNewEmail);
        // };
    }, [emailsData, sortBy, searchTerm, location, size]);

    const onSortBy = (sortOp) => {
        setSortBy(sortOp);
        emailService.sortBy(sortOp).then(sortedEmails => {
            setEmailsData(sortedEmails);
        });
    };

    const onRemoveEmail = async (emailId) => {
        const emails = await emailService.removeEmail(emailId);
        setEmailsData(emails);
        eventBusService.emit('showMsg', 'Email removed');
    };

    const onFilterBy = async (filterBy) => {
        if (filterBy === "all") setIsFilter(false);
        else setIsFilter(true);
        const filterByObj = {identifier: 'filterBy', filterBy};
        const emails = await emailService.filterEmails(filterByObj);
        setFilteredEmails(emails);
    };

    const searchHandler = async (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const emails = await emailService.filterEmails(searchTerm);
            setFilteredEmails(emails);
        }
    };

    const openBackdrop = () => {
        setShow(true);
    };

    const closeBackdrop = () => {
        setShow(false);
    };

    return (
        <section className="email-app">
            <div className="search-container">
                <Filter term={searchTerm} searchKeyword={searchHandler} filterBy={onFilterBy} isEmail={true} />
                <EmailMobileMenu />
            </div>
            <EmailSort sortBy={onSortBy} />
            <div className="main-content">
                <Backdrop show={show} />
                <EmailSideBar openBackdrop={openBackdrop} closeBackdrop={closeBackdrop} isMobile={isMobile} />
                <EmailList emails={(searchTerm.length > 0 || isFiltered) ? filteredEmails : emailsData} removeEmail={onRemoveEmail} />
            </div>
        </section>
    );
};
