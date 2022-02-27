import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { EmailReply } from './EmailReply';
import {emailService} from "./../services/emailService";
import {eventBusService} from "./../../../services/eventBusService";
import './EmailDetails.css'

export const EmailDetails = () => {
    const [email, setEmail] = useState({});
    const [emailId, setEmailId] = useState(null);
    const [isReply, setIsReply] = useState(false);
    const params = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const loadEmail = async () => {
            setEmailId(params.emailId);
            const emailData = await emailService.getEmailById(emailId); //todo getEmailById
            setEmail(emailData);
        };
        loadEmail();
    }, [email, params, emailId]);

    const onRemoveEmail = async () => {
        await emailService.removeEmail(emailId);
        onGoBack();
        eventBusService.emit('showMsg', 'Email removed');
    };

    const onReply = () => { 
        setIsReply(!isReply);
    };

    const onGoBack = () => {
        navigate('/email');
    };

    return (
        <>
            {(!email) ? <div>...loading</div> :
                <section className="email-details">
                    <h1>Subject: {email.subject}</h1>
                    <h3>From: {email.from}</h3>
                    <p className="email-body">{email.body}</p>
                    <div className="actions">
                        <button onClick={onRemoveEmail} className="delete">Delete</button>
                        <button onClick={onReply} className="reply">Reply</button>
                        <button onClick={onGoBack} className="back-to-emails">Back</button>
                    </div>
                    {isReply && <EmailReply email={email} hideReply={onReply}/>}
                </section>
            }
        </>
    );
};;
