import React, {useState, useEffect} from 'react';
import {useClickOutside} from '../../../cmps/useClickOutside';
import {ReminderForm} from './ReminderForm';
import {ShareButtons} from './ShareButtons';
import {UploadImage} from "./UploadImage";
import {ColorPicker} from "./ColorPicker";
import {CanvasDrawing} from './CanvasDrawing';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddAlertOutlinedIcon from '@mui/icons-material/AddAlertOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import LongMenu from "./LongMenu";
import './ActionButtons.css';

export const ActionButtons = ({note, title, items, noteId, isImage, uploadedImage, isDetailed, closeDetailedMenu, updateNotesList, scrollNoteToView}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isModifyBg, setIsModifyBg] = useState(false);
  const [isDrawMenuOpen, setIsDrawMenuOpen] = useState(false);
  const [isBgImage, setIsBgImage] = useState(true);
  const [currentNoteId, setCurrentNoteId] = useState(noteId);


  useEffect(() => {
    noteId ? setCurrentNoteId(noteId) : setCurrentNoteId(currentNoteId);
  }, [isBgImage, noteId, currentNoteId]);

  let actionButtonsRef = useClickOutside(() => {
    setIsModifyBg(false);
    setIsFormOpen(false);
    setIsShareOpen(false);
    setIsDrawMenuOpen(false);
    setIsBgImage(true);

  });

  let bodyStr = items?.reduce((acc, item) => {
    return acc + item.txt + "\n";
  }, '');
  bodyStr = bodyStr?.concat("\n");

  const onToggleForm = () => {
    if (!isFormOpen) {
      setIsShareOpen(false);
      setIsModifyBg(false);
      setIsDrawMenuOpen(false);
    }
    setIsFormOpen(!isFormOpen);
  };

  const onCloseForm = () => {
    setIsFormOpen(false);
  };

  const onToggleShare = () => {
    if (!isShareOpen) {
      setIsFormOpen(false);
      setIsModifyBg(false);
      setIsDrawMenuOpen(false);
    }
    setIsShareOpen(!isShareOpen);
  };

  const onToggleDraw = () => {
    setIsFormOpen(false);
    setIsShareOpen(false);
    setIsModifyBg(false);
    setIsDrawMenuOpen(!isDrawMenuOpen);
    setIsBgImage(false);
  };

  const onToggleBg = () => {
    setIsFormOpen(false);
    setIsShareOpen(false);
    setIsDrawMenuOpen(false);
    setIsModifyBg(!isModifyBg);
  };

  const scrollingTiming = async () => {
    const scrollTimeout = await setTimeout(() => {
      scrollNoteToView();
      clearTimeout(scrollTimeout);
    }, 200);
  };
  
  const isImageLoad = ({isLoaded}) => {
    isImage(isLoaded);
    if (isLoaded) {
      scrollingTiming();
    }
  };
  
  const scrollCanvasToView = () => {
    scrollingTiming();
  };

  return (
    <div ref={actionButtonsRef} className={`actionButtons-container ${ isDetailed ? 'detailed' : '' }`}>
      <Tooltip title="Remind me">
        <IconButton onClick={onToggleForm}>
          <AddAlertOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Collaborate">
        <IconButton onClick={onToggleShare}>
          <ShareOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Background options">
        <IconButton onClick={onToggleBg}>
          <ColorLensOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add drawing">
        <IconButton onClick={onToggleDraw}>
          <BrushOutlinedIcon />
        </IconButton>
      </Tooltip>


      {isFormOpen && <ReminderForm title={title} isDetailed={isDetailed} bodyStr={bodyStr} closeForm={onCloseForm} />}
      {isShareOpen && <ShareButtons title={title} isDetailed={isDetailed} bodyStr={bodyStr} />}
      {isModifyBg && <ColorPicker isDetailed={isDetailed} noteId={noteId} />}
      <UploadImage noteId={currentNoteId} note={note} isBgImage={isBgImage} isImageLoad={isImageLoad} />
      {isDrawMenuOpen && <CanvasDrawing scrollCanvasToView={scrollCanvasToView} noteId={noteId} isDetailed={isDetailed} uploadedImage={uploadedImage} />}
      <LongMenu noteId={noteId} updateNotesList={updateNotesList} />
      {isDetailed && <IconButton className="closeBtn-container" onClick={() => closeDetailedMenu()}>
        <div className="closeBtn">Close</div>
      </IconButton>}
    </div>
  );
};
