import * as React from 'react';
import {keepService} from '../services/keepService';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './LongMenu.css'

const options = [
  'delete',
  // 'None',
  // 'Atria',
  // 'Callisto',
  // 'Dione',
  // 'Ganymede',
  // 'Hangouts Call',
  // 'Luna',
  // 'Oberon',
  // 'Phobos',
  // 'Pyxis',
  // 'Sedna',
  // 'Titania',
  // 'Triton',
  // 'Umbriel',
];

const ITEM_HEIGHT = 48;

export default function LongMenu ({noteId, updateNotesList, isDetailed}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async () => {
    setAnchorEl(null);
    const updatedNotes = await keepService.deleteNote(noteId);
    updateNotesList(updatedNotes);
  };

  return (
    <div className={`longMenu ${ isDetailed ? 'detailed' : '' }`}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '9ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'delete'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}