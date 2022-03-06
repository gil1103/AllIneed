import React, {useState} from 'react';
import 'date-fns';
import {TextField} from '@material-ui/core';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {AddCalendarEvent} from './AddCalendarEvent ';
import './ReminderForm.css';

export const ReminderForm = ({title, closeForm, bodyStr, isDetailed}) => {
  const [dateAndTime, setDateAndTime] = useState({
    startDate: '', startTime: '', occurrence: 'does-not-repeat'
  });

  const recurrenceArr = [
    {
      id: 1,
      value: 'DAILY',
      label: 'Daily',
    },
    {
      id: 2,
      value: 'WEEKLY',
      label: 'Weekly',
    },
    {
      id: 3,
      value: 'MONTHLY',
      label: 'Monthly',
    },
    {
      id: 4,
      value: 'YEARLY',
      label: 'Yearly',
    },
    {
      id: 5,
      value: 'does-not-repeat',
      label: 'Does not repeat',
    }
  ];

  const onInputChange = (ev) => {
    ev.preventDefault();
    const {target: {name, value}} = ev;
    setDateAndTime(oldValues => ({...oldValues, [name]: value}));
  };

  const addReminder = () => {
    closeForm();
    const currentTimeMili = Date.parse(new Date().toISOString());
    let duration;
    if (dateAndTime.startDate && dateAndTime.startTime) {
      const meetingTime = `${ dateAndTime.startDate }T${ dateAndTime.startTime }:00+02:00`;
      let meetingTimeMili = Date.parse(new Date(meetingTime).toISOString());
      duration = meetingTimeMili - currentTimeMili;
    };
    const timer = setTimeout(() => {
      alert(`reminder: ${ title }`);
    }, duration);
    return () => clearTimeout(timer);
  };

  return (
    <div className={`todo-reminder ${ isDetailed ? "detailed" : "" }`}>
      <div className="reminder-title">Pick date &amp; time</div>
      <hr />
      <FormControl className="reminder-form" variant="standard"
        sx={{m: 1, minWidth: 120, input: {color: '#3c4043'}}}>
        <TextField
          id="date"
          type="date"
          name="startDate"
          value={dateAndTime.startDate}
          onChange={onInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          className="reminder-textfield"
          style={{borderBottom: 'red'}}
        />
        <TextField
          id="time"
          name="startTime"
          type="time"
          value={dateAndTime.startTime}
          onChange={onInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={dateAndTime.occurrence}
          onChange={onInputChange}
          name='occurrence'
          className="reminder-select"
        >
          {recurrenceArr.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.label}
            </MenuItem  >
          ))}
        </Select>
      </FormControl>
      <AddCalendarEvent dateAndTime={dateAndTime} bodyStr={bodyStr} title={title} addReminderToEvent={addReminder} />
    </div>
  );
};
