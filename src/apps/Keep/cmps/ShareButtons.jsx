import React from 'react';
import './ShareButtons.css';
import {
  EmailShareButton, WhatsappShareButton, EmailIcon, WhatsappIcon
} from "react-share";

export const ShareButtons = ({title, bodyStr, isDetailed}) => {


  return (
    <div className={`shareBtns-container ${ isDetailed ? 'detailed' : '' }`}>
      <WhatsappShareButton
        url="https://web.whatsapp.com/"
        title={title}
      >
        <WhatsappIcon size={40} round={true} />
      </WhatsappShareButton>
      <EmailShareButton
        url="https://mail.google.com/mail/u/0/#inbox?compose=new"
        subject={title}
        body={bodyStr}
      >
        <EmailIcon size={40} round={true} />
      </EmailShareButton>
    </div>
  );
};
