import React, {useRef, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useWindowSize} from '../../../services/useWindowSize';
import {emailService} from '../services/emailService';
import './EmailReply.css';

export const EmailReply = ({email, hideReply}) => {
  const emailBody = useRef(null);
  let navigate = useNavigate();
  const size = useWindowSize();
  const [isDisabled, setIsDisabled] = useState(false);
  const [textareaVal, setTextareaVal] = useState('');

  useEffect(() => {
    emailBody.current.focus();
  }, []);



  useEffect(() => {
    let isValid = () => {
      if (textareaVal && textareaVal.length > 0) {
        return textareaVal.length > 5;
      } else return false;
    };
    setIsDisabled(!isValid());

  }, [textareaVal, isDisabled]);

  const onSend = async () => {
    const date = new Date().toUTCString();
    const body = `On ${ date } loggedIn user <user@gmail.com> wrote:${ emailBody.current.value }\n ${ email.body } `;
    await emailService.addReply(body, email.id);
    emailBody.current.value = body;
    hideReply();
    navigate('/email');
  };

  const textareaForWideScreen = <textarea cols="40" rows="6" name="body" value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} ref={emailBody} ></textarea>;
  const textareaForMobile = <textarea cols="40" rows="3" name="body" value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} ref={emailBody} ></textarea>;

  return (
    <div className="reply-body">
      {size.width < 720 ? textareaForMobile : textareaForWideScreen}
      <button className={isDisabled ? 'disabled' : ''} onClick={onSend}>Send Reply</button>
    </div>
  );
};
