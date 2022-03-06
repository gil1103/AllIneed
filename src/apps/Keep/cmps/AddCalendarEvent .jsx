import React, {useEffect} from 'react';
import './AddCalendarEvent.css';
// import {gapi} from 'gapi-script';

//export a function that gets start time(date picker), location, name 
export const AddCalendarEvent = ({dateAndTime, title, addReminderToEvent, bodyStr}) => {
  var gapi = window.gapi;
  // Client ID and API key from the Developer Console
  // {"web": {"client_id": "928877465631-qf1r3883erpg172svp9bkgkdav43l97g.apps.googleusercontent.com", "project_id": "note-react-336610", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_secret": "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";} }
  var CLIENT_ID = '928877465631-qf1r3883erpg172svp9bkgkdav43l97g.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDivjN_GL-BhyA8Xar0g2Bfr0rwHiByptY';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  useEffect(() => {

  }, [gapi]);

  const handleClick = () => {
    addReminderToEvent();
    gapi.load('client:auth2', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load('calendar', 'v3', () => console.log('bam!'));
      //time zone list:
      // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      let timeZone = "Asia/Jerusalem";
      let duration = '00:30:00'; //duration of each event, here 30 minuts
      //event start time - im passing datepicker time, and making it match      
      //with the duration time, you can just put iso strings:
      //2020-06-28T09:00:00-07:00' 

      let isoStringDate = `${ dateAndTime.startDate }T${ dateAndTime.startTime }:00+02:00`;
      // let startDate = new Date('2020-06-28T09:00:00-07:00');
      let startDate = new Date(isoStringDate);
      let msDuration = (Number(duration.split(':')[0]) * 60 * 60 + Number(duration.split(':')[1]) * 60 + Number(duration.split(':')[2])) * 1000;
      let endDate = new Date(startDate.getTime() + msDuration);
      let isoStartDate = new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split(".")[0];
      let isoEndDate = new Date(endDate.getTime() - (new Date().getTimezoneOffset()) * 60 * 1000).toISOString().split(".")[0];

      let freq = dateAndTime.occurrence === 'does-not-repeat' ? 'DAILY' : dateAndTime.occurrence;
      let count = dateAndTime.occurrence === 'does-not-repeat' ? '1' : '10';

      //sign in with pop up window
      gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          let event = {
            'summary': `${ title }`, // or event name
            'location': 'address', //where it would happen
            'description': `${ bodyStr }`,
            'start': {
              'dateTime': isoStartDate,
              'timeZone': timeZone
            },
            'end': {
              'dateTime': isoEndDate,
              'timeZone': timeZone
            },
            'recurrence': [
              `RRULE:FREQ=${ freq };COUNT=${ count }`
            ],
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'popup', 'minutes': 20}
              ]
            }
          };

          //if you need to list your events than keep it
          // gapi.client.calendar.events.list({
          //   'calendarId': 'primary',
          //   'timeMin': (new Date()).toISOString(),
          //   'showDeleted': false,
          //   'singleEvents': true,
          //   'maxResults': 10,
          //   'orderBy': 'startTime'
          // }).then(response => {
          //   const events = response.result.items;
          //   console.log('EVENTS: ', events);
          // });
          //end of event listing

          let request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
          });

          request.execute(event => {
            console.log(event);
            // window.open(event.htmlLink);
          });
        });
    });
  };


  return (
    <div className="addToCalender-container">
      <button className="addToCalender-btn" onClick={handleClick}>Save</button>
    </div>
  );
};
