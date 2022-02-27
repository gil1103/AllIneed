import React from 'react'
import './AddNote.css'

export const AddNote = () => {
  const {info: {title, txt}, style: {backgroundColor}} = note;
  const [noteTxtInfo, setNoteTxtInfo] = useState({
    title: title, body: txt, bgColor: backgroundColor
  });


  const onInputChange = ({target: {value, name}}) => {
    setNoteTxtInfo(oldValues => ({...oldValues, [name]: value}));
  };

  return (
    <div className="note-text" style={{backgroundColor: noteTxtInfo.bgColor}}>
      <input type="text" placeholder="Title" name="title"
        value={noteTxtInfo.title} onChange={onInputChange} />
      <input type="checkbox" placeholder="+List item" name="body" value={noteTxtInfo.body}
        onChange={onInputChange} />
    </div>
  );
}
