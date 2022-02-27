import React, {useEffect, useState} from 'react';
import {eventBusService} from "../services/eventBusService";
import './UserMsg.css';

export const UserMsg = () => {
  const [msg, setMsg] = useState('');
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const handleShowMsg = (msg) => {
      setMsg(msg);
      setIsShown(true);
      setTimeout(() => {
        setIsShown(false);
      }, 4000);
    };
    eventBusService.on('showMsg', handleShowMsg);

    return () => {
      window.removeEventListener('showMsg', handleShowMsg);
    };

  }, [msg, isShown]);

  return (
    <div className="user-msg animate">
        {isShown && msg}

      </div>
  );
};

