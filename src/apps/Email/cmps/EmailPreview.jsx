import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {utilService} from '../../../services/utilService';
import {emailService} from '../services/emailService';
import deleteMailIcon from '../images/trash.png';
import emailReadIcon from '../images/mail-read.png';
import emailUnreadIcon from '../images/mail-unread.png';
import {useWindowSize} from '../../../services/useWindowSize';
import './EmailPreview.css';

export const EmailPreview = ({email, removeEmail}) => {
    const [time, setTime] = useState(null);
    const [isRead, setIsRead] = useState(email.isRead);
    const size = useWindowSize();

    useEffect(() => {
        setTime(utilService.changeStempToDate(email.sentAt));
    }, [isRead, email.sentAt]);

    const toggleMarkAsRead = (event) => {
        event.preventDefault();
        setIsRead(!isRead);
        emailService.changeReadUnread(email.id);
    };

    const deleteEmail = async (event) => {
        event.preventDefault();
        await removeEmail(email.id);
    };

    const markAsRead = () => {
        emailService.markRead(email.id);
    };

    const isMobile = size.width < 800 ? true : false;
    return (
        <Link to={`/email/${ email.id }`} onClick={markAsRead}>
            <li className={`${ isRead ? 'is-read' : '' } email-preview`}>
                <div className="email-body-container">
                    <span className="email-from">{email.from}</span>
                    <span className="email-subject">{email.subject}</span>
                    {/* <span className="email-body">{size.width < 800 ? utilService.shortenText(email.body, 22) : utilService.shortenText(email.body, 60)}</span> */}
                    <span className="email-body">{email.body}</span>
                </div>
                <div className="time-and-actions">
                    <span>{time}</span>
                    {!isMobile && <button onClick={deleteEmail}>
                        <img src={deleteMailIcon} alt="" />
                    </button>}
                    {!isMobile &&<button onClick={toggleMarkAsRead}>
                        <img src={`${ isRead ? emailReadIcon : emailUnreadIcon
                            }`} alt='' title={`${ isRead ? 'Mark as read' : 'Mark as unread' }`} />
                    </button>}
                </div>
            </li>
        </Link>
    );
};
