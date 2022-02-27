import React from 'react'
import './Backdrop.css'

export const Backdrop = (props) => {
  const cssClasses =[
    'backdrop', props.show ? 'backdropOpen':'backdropClose'
  ]
  return (
    <div className={cssClasses.join(' ')}>
      
    </div>
  )
}
