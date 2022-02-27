import React, {useRef, useState, useEffect} from 'react';
import {emailService} from "./../services/emailService";
import {eventBusService} from "./../../../services/eventBusService";
import trashImg from '../images/trash.png';
import './EmailCompose.css';

export const EmailCompose = ({closeModal}) => {
  const [emailTo, setEmailTo] = useState('');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const addressee = useRef(null);

  useEffect(() => {
    addressee.current.focus();
  }, []);

  const onCloseModal = async (saveToDraft) => {
    const emailObj = {
      to: emailTo,
      subject: emailSubject,
      body: textareaVal
    };
    if (saveToDraft) {
      const isDraft = true;
      await emailService.sendMail(emailObj, isDraft);
    }
    closeModal(true);
  };

  const onSendEmail = async (ev) => {
    ev.preventDefault();
    eventBusService.emit('showMsg', 'Email Sent');
    const emailObj = {
      to: emailTo,
      subject: emailSubject,
      body: textareaVal
    };
    await emailService.sendMail(emailObj, false);
    // const newEmail = await emailService.sendMail(emailObj);
    closeModal(true);
  };


  return (
    <section className="email-compose">
      <header>
        <h1>New Message</h1>
        <button className='close-btn' onClick={() => onCloseModal('saveToDraft')}>X</button>
      </header>
      <form className="compose-form" onSubmit={onSendEmail}>
        <input type="text"
          placeholder="To"
          value={emailTo}
          ref={addressee}
          name='to'
          autoComplete="off"
          onChange={(e) => setEmailTo(e.target.value)} />
        <input type="text"
          placeholder="Cc"
          value={emailCc}
          name='cc'
          autoComplete="off"
          onChange={(e) => setEmailCc(e.target.value)} />
        <input type="text"
          placeholder="Subject"
          value={emailSubject}
          name='subject'
          autoComplete="off"
          onChange={(e) => setEmailSubject(e.target.value)} />
        <textarea cols="90" rows="10" name="body" value={textareaVal} placeholder="Message..."
          onChange={(e) => setTextareaVal(e.target.value)} >
        </textarea>
        <div className="button-container">
          <button type="submit">Send</button>
          <div onClick={onCloseModal} className="trash">
            <img src={trashImg} alt="" />
          </div>
        </div>
      </form>
    </section>
  );
};
