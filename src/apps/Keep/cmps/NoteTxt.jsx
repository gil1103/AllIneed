import React, {useState} from 'react';
import './NoteTxt.css';

export const NoteTxt = ({note}) => {
  const {info: {title}, style: {backgroundColor}, items} = note;
  const [checkedState, setCheckedState]=useState(items.map(item=>{
    return item.isChecked
  }))
  const handleChange = (index)=>{
    let updatedList =[...checkedState]
    updatedList.splice(index,1,!checkedState[index])
    setCheckedState(updatedList)
  }

  const Checkbox = ({txt, index, checked}) => (
    <>
      <input onChange={(ev)=>handleChange(ev,index)} type="checkbox" name={txt} 
        value={txt} checked={checked} id={`checkbox-${ index }`} />
      <label className={`${checked?"checked":""}`} htmlFor={`checkbox-${ index }`}>{txt}</label>
    </>
  );

  return (
    <div className="note-text" style={{backgroundColor: backgroundColor}}>
      <h1>{title}</h1>
      {items && <ul>
        {items.map(({txt}, index) => {
          return (
            <li key={index}>
              <Checkbox txt={txt} index={index} checked={checkedState[index]} />
            </li>
          );
        })}
      </ul>}
    </div>
  );
};
