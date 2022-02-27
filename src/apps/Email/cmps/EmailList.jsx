import React from 'react';
import {EmailPreview} from './EmailPreview';
import './EmailList.css';

export const EmailList = ({emails, removeEmail}) => {
    return (
        <section className="emails-container">
            <ul className="emails-list">
                {emails.map(email => {
                    return (
                        <EmailPreview key={email.id} email={email} removeEmail={removeEmail} />
                    );
                })}
            </ul>
        </section>
    );
};



