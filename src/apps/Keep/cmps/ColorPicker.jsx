import React, {useState} from 'react';
import {CirclePicker } from 'react-color';
import {keepService} from '../services/keepService';
import './ColorPicker.css'

export const ColorPicker = ({noteId, isDetailed}) => {
  const [bgColor, setBgColor] = useState('#9ff59f')

  const handleChangeComplete = async(color)=>{
    setBgColor(color.hex)
    await keepService.modifyColor(color.hex, noteId)
  }

  return (
    <div className={`circlePicker-container ${ isDetailed ?'detailed':''}`}>
      <CirclePicker
        color={bgColor}
        onChangeComplete={handleChangeComplete }
        width={380}
      />
    </div>
  )
}
