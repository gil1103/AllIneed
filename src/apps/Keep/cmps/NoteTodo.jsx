import React, {useState, useEffect, useRef, useCallback} from 'react';
import {keepService} from "./../services/keepService";
import {ActionButtons} from "./ActionButtons";
import {useClickOutside} from '../../../cmps/useClickOutside';
import {useWindowSize} from '../../../services/useWindowSize';
import './NoteTodo.css';
import {RiPushpin2Fill, RiPushpin2Line} from "react-icons/ri";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import ReactPlayer from 'react-player';
import TextareaAutosize from 'react-textarea-autosize';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

export const NoteTodo = ({note, updateIsDetailedState, isNewList, updateNotesList, setNoteDims, scrollNoteToView, updateIsPinnedStatus, deleteMediaUpdate}) => {
  const {info: {title}, style: {backgroundColor}, items, type,
    uploadedFile: {fileType, fileUrl}, canvasDrawing: {drawnImage, uploadedImage}} = note;

  const noteId = note.id;
  const [isPinned, setIsPinned] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [checkedItems, setCheckedItems] = useState(items ? items.filter(item => item.isChecked) : '');
  const [unCheckedItems, setUnCheckedItems] = useState(items ? items.filter(item => !item.isChecked) : '');
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [isFinishAddingTodo, setIsFinishAddingTodo] = useState(false);
  const [newTodoTxt, setNewTodoTxt] = useState('');
  const [mediaRemoveIconShown, setMediaRemoveIconShown] = useState(false);
  const [canvasRemoveIconShown, setCanvasRemoveIconShown] = useState(false);
  const [mediaCanvasHeight, setMediaCanvasHeight] = useState('');
  const [noteTitle, setNoteTitle] = useState(title);
  const [isEmptyObj, setIsEmptyObj] = useState(false);
  const [noteHeight, setNoteHeight] = useState('');
  const [mediaContainerHeight, setMediaContainerHeight] = useState('');
  const noteTodoTopPercent = (fileUrl || drawnImage) ? 0.05 : 0.3;
  const newTodoRef = useRef();
  const mediaContainerRef = useRef();
  const size = useWindowSize();
  const windowHeight = size.height;
  const windowWidth = size.width;
  let gHightCorrectionCounter = 0;
  let noteTodoRef = useClickOutside(() => {
    setIsFinishAddingTodo(true);
    setIsDetailed(false);
  });
  const curNoteHeight = noteTodoRef.current?.clientHeight;
  const curNoteWidth = noteTodoRef.current?.clientWidth;

  const calcMediaCanvasHeight = useCallback(() => {
    let height;
    if (isDetailed && (fileUrl && drawnImage)) {
      height = Math.round(0.6 * windowHeight);
    } else if (isDetailed && (fileType === "image" || drawnImage)) {
      height = Math.round(1.08 * windowHeight);
    } else if (fileType === "image" || drawnImage) {
      height = Math.round(0.25 * windowHeight);
    } else if (!fileUrl && !drawnImage) {
      height = 0;
    } else height = 'auto';
    return `${ height }px`;
  }, [windowHeight, fileUrl, isDetailed, drawnImage, fileType]);

  const updateDimChange = useCallback(() => {
    let HightCorrection = 0;
    let dimensions;
    const clientHeight = mediaContainerRef.current?.clientHeight;
    const isImgAdded = clientHeight > mediaContainerHeight ? true : false;
    if ((isImgAdded && fileUrl) && gHightCorrectionCounter === 0) {
      HightCorrection = 157;
      gHightCorrectionCounter++;
    }
    if ((isImgAdded && drawnImage) && gHightCorrectionCounter === 0) {
      HightCorrection = 15;
      gHightCorrectionCounter++;
    }
    setNoteHeight(curNoteHeight + HightCorrection);
    if (mediaContainerHeight !== mediaContainerRef.current?.clientHeight) {
      setMediaContainerHeight(mediaContainerRef.current?.clientHeight);
    }
    dimensions = {noteWidth: curNoteWidth, noteHeight: curNoteHeight + HightCorrection};
    return dimensions;
  }, [mediaContainerRef, fileUrl, drawnImage, mediaContainerHeight, gHightCorrectionCounter, curNoteHeight, curNoteWidth]);

  useEffect(() => {
    const isObjectEmpty = () => {
      return ((title === null || title.length === 0) && items.length === 0 && !fileUrl && !drawnImage);
    };
    isObjectEmpty() ? setIsEmptyObj(true) : setIsEmptyObj(false);
    setMediaCanvasHeight(calcMediaCanvasHeight());
    updateIsDetailedState(isDetailed);
  }, [size, fileUrl, isDetailed, items, title, drawnImage, updateIsDetailedState, mediaCanvasHeight, isShown, calcMediaCanvasHeight, isLoadingImg, backgroundColor, isFinishAddingTodo, newTodoTxt]);

  useEffect(() => {
    if (newTodoRef.current) newTodoRef.current.focus();
    let dimensions = {noteWidth: curNoteWidth, noteHeight: curNoteHeight};
    if (curNoteHeight && (curNoteHeight !== noteHeight)) {
      dimensions = updateDimChange();
      setNoteDims(dimensions);
    }
    setIsPinned(note.isPinned)
  }, [newTodoTxt, setNoteDims, updateDimChange, note.isPinned, noteId, noteHeight, curNoteHeight, isPinned, curNoteWidth, fileType, isLoadingImg]);

  useEffect(() => {
    if (isNewList) setIsDetailed(true);
  }, [isNewList]);

  const closeDetailedMenu = () => {
    setIsFinishAddingTodo(true);
    setIsDetailed(false);
  };

  const handleChange = async ({target: {checked}}, index) => {
    if (checked) {
      await keepService.toggleCheck(noteId, unCheckedItems[index].id);
      let updatedCheckedList = [unCheckedItems[index], ...checkedItems];
      setCheckedItems(updatedCheckedList);
      let updatedUncheckedList = [...unCheckedItems];
      updatedUncheckedList.splice(index, 1);
      setUnCheckedItems(updatedUncheckedList);
    }
    else {
      await keepService.toggleCheck(noteId, checkedItems[index].id);
      let updatedUncheckedList = [checkedItems[index], ...unCheckedItems];
      setUnCheckedItems(updatedUncheckedList);
      let updatedCheckedList = [...checkedItems];
      updatedCheckedList.splice(index, 1);
      setCheckedItems(updatedCheckedList);
    }
  };

  const onAddNewTodo = async (e) => {
    if (e.key === 'Enter' || isFinishAddingTodo) {
      const newTodoItem = await keepService.addNewTodo(newTodoTxt, noteId);
      setUnCheckedItems([...unCheckedItems, newTodoItem]);
      setNewTodoTxt('');
      setIsFinishAddingTodo(false);
    }
  };

  const showButton = e => {
    e.preventDefault();
    setIsShown(true);
  };

  const hideButton = e => {
    e.preventDefault();
    setIsShown(false);
  };

  const onDeleteItem = async (itemId) => {
    const updatedItemsList = await keepService.deleteItem(noteId, itemId);
    setCheckedItems(updatedItemsList.filter(item => item.isChecked));
    setUnCheckedItems(updatedItemsList.filter(item => !item.isChecked));
    const refreshTimeout = setTimeout(() => {
      window.location.reload(false);
      clearTimeout(refreshTimeout);
    }, 10);
  };

  const handleItemTextChange = async (ev, itemId, isChecked) => {
    ev.preventDefault();
    const updatedTxt = ev.target.value;
    const listToUpdate = isChecked ? [...checkedItems] : [...unCheckedItems];
    listToUpdate.forEach(item => {
      if (item.id === itemId) {
        item.txt = updatedTxt;
      }
    });
    isChecked ? setCheckedItems(listToUpdate) : setUnCheckedItems(listToUpdate);
    await keepService.editItemTxt(noteId, itemId, updatedTxt);
  };

  const handleTitleChange = async (ev) => {
    setNoteTitle(ev.target.value);
    await keepService.editTitle(noteId, noteTitle);
  };

  const onDeleteMedia = async (noteId, fileType) => {
    await keepService.deleteMedia(noteId, fileType);
    deleteMediaUpdate()
  };
  
  const onDeleteCanvas = async (noteId) => {
    await keepService.deleteCanvas(noteId);
    deleteMediaUpdate()
  };

  const onMouseOverMediaCanvas = () => {
    setMediaRemoveIconShown(true);
    setCanvasRemoveIconShown(true);
  };

  const onMouseLeaveMediaCanvas = () => {
    setMediaRemoveIconShown(false);
    setCanvasRemoveIconShown(false);
  };

  const updateLoadingStatus = (isImage) => {
    setIsLoadingImg(isImage);
  };

  const onToggleIsPinned=async()=>{
    await keepService.toggleIsPinned(noteId)
    setIsPinned(!isPinned)
    updateIsPinnedStatus(noteId, isPinned)
  }

  return (
    <div ref={noteTodoRef} className={`note-todo ${ isDetailed ? 'detailed' : '' }`}
      style={{
        backgroundColor: backgroundColor, maxHeight: `${ windowHeight * 0.74 }px`,
        top: `${ isDetailed ? Math.round(noteTodoTopPercent * windowHeight) : '0' }px`,
        left: `${ isDetailed ? Math.round((windowWidth - 600) / 2 - 200) : '0' }px`,
        border: `${ fileType === "video" ? 'none' : '1px solid #52616b' }`
      }}
      onMouseEnter={e => showButton(e)} onMouseLeave={e => hideButton(e)}>
      {!isPinned && <RiPushpin2Line className="pin" style={{
        right: `${ isDetailed ? '24' : '6' }px`,
        backgroundColor: `${ fileType === "video" ? 'white' : '' }`
      }}
        onClick={onToggleIsPinned} />}
      {isPinned && <RiPushpin2Fill className="pin" style={{
        right: `${ isDetailed ? '24' : '6' }px`,
        backgroundColor: `${ fileType === "video" ? 'white' : '' }`
      }}
        onClick={onToggleIsPinned} />}
      <div className="media_canvas-container"
        style={{overflowY: `${ (fileUrl || drawnImage) ? 'auto' : 'hidden' }`}}
      >
        <div className={`media_canvas ${ isDetailed ? 'detailed' : '' }`}
          onMouseOver={onMouseOverMediaCanvas}
          onMouseLeave={onMouseLeaveMediaCanvas}
          onClick={() => setIsDetailed(true)}
          style={{height: `${ mediaCanvasHeight }`}}>
          <div ref={mediaContainerRef} className="media-container"
            style={{width: `${ fileUrl ? '100%' : '' }`}}
          >
            {fileType === "image" && <img className="uploaded-img"
              src={fileUrl} alt="" style={{borderRadius: `${ drawnImage ? '8px 0 0 0' : '8px 8px 0 0' }`}}
            />}
            {fileType === "video" && <ReactPlayer url={fileUrl} width='100%'
              height='100%' controls={true} />}
            {(!fileUrl) && <ProgressBar animated now={100} />}
            {isDetailed && fileUrl && mediaRemoveIconShown &&
              <Tooltip title="Remove">
                <IconButton className="remove-media" onClick={() => onDeleteMedia(noteId, fileType)}
                  onMouseOver={() => setMediaRemoveIconShown(true)}
                  onMouseLeave={() => setMediaRemoveIconShown(false)}
                  style={{
                    bottom: "10px",
                    left: `${ !drawnImage ? 530 : 240 }px`,
                    backgroundColor: `${ fileType === "video" ? '#dee2e6' : '' }`
                  }}>
                  <DeleteRoundedIcon />
                </IconButton>
              </Tooltip>
            }
          </div>
          {drawnImage && <img className="canvas-img" src={drawnImage} alt=""
            style={{
              backgroundImage: `url(${ uploadedImage })`,
              borderRadius: `${ !fileUrl ? '8px 8px 0 0' : '0 8px 0 0' }`,
              width: `${ !fileUrl ? '100%' : '50%' }`
            }}
          />}
          {isDetailed && drawnImage && canvasRemoveIconShown && <Tooltip title="Remove">
            <IconButton className="remove-canvas" onClick={() => onDeleteCanvas(noteId)}
              style={{bottom: "10px"}}
              onMouseOver={() => setCanvasRemoveIconShown(true)}
              onMouseLeave={() => setCanvasRemoveIconShown(false)}
            >
              <DeleteRoundedIcon />
            </IconButton>
          </Tooltip>}

        </div>
        <div className="todo-list-container">
          <TextareaAutosize className="note-todo-title" minRows={1}
            value={noteTitle} placeholder={`${ isDetailed ? "Title" : type === "NoteMedia" ? "Title" : "" }`}
            onChange={(ev) => handleTitleChange(ev)} onClick={() => setIsDetailed(true)} />
          {isEmptyObj && !isDetailed && <h3 className="empty-note">Empty note</h3>}
          {unCheckedItems && <ul>
            {unCheckedItems.map(({txt, id}, index) => {
              const isChecked = false;
              return (
                <li key={index} >
                  <input className="checkbox" onChange={(ev) => handleChange(ev, index)}
                    type="checkbox" checked={isChecked} id={`checkbox-${ index }`} />
                  <TextareaAutosize className="list-item" minRows={1}
                    value={txt} onClick={() => setIsDetailed(true)}
                    onChange={(ev) => handleItemTextChange(ev, id, isChecked)} />
                  <Tooltip title="Delete" >
                    <IconButton className="delete-icon" onClick={() => onDeleteItem(id)} >
                      <ClearOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </li>
              );
            })}
          </ul>}
          {checkedItems.length > 0 && unCheckedItems.length > 0 && <hr />}
          {checkedItems && <ul>
            {checkedItems.map(({txt, id}, index) => {
              const isChecked = true;
              return (
                <li key={index}>
                  <input className="checkbox" onChange={(ev) => handleChange(ev, index)}
                    type="checkbox" checked={isChecked} id={`checkbox-${ index }`} />
                  <TextareaAutosize className="list-item checked" minRows={1}
                    value={txt} onClick={() => setIsDetailed(true)}
                    onChange={(ev) => handleItemTextChange(ev, id, isChecked)} />
                  <Tooltip title="Delete">
                    <IconButton className="delete-icon" onClick={() => onDeleteItem(id)}>
                      <ClearOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </li>
              );
            })}
          </ul>}
          {isDetailed && fileType !== "video" && type !== "NoteMedia" && <div className="listItems-container">
            <label htmlFor="list-item">+</label>
            <input value={newTodoTxt} ref={newTodoRef} autoComplete="off"
              type="text" placeholder="List item" onKeyDown={onAddNewTodo} className="new-todo-input"
              style={{backgroundColor: backgroundColor}} id="list-item" onChange={(e) => setNewTodoTxt(e.target.value)}
            />
          </div>}
        </div>
      </div>
      {(!isShown || isDetailed) && <div className="action-button-placeholder"></div>}
      {(isShown || isDetailed) && <div className={`action-button-container ${ !isDetailed ? 'notDetailed' : '' }`}>
        <ActionButtons title={title} isDetailed={isDetailed} items={items} uploadedImage={uploadedImage}
          noteId={note.id} note={note} closeDetailedMenu={closeDetailedMenu} isImage={updateLoadingStatus}
          updateNotesList={updateNotesList} scrollNoteToView={scrollNoteToView}/>
      </div>}
    </div>
  );
};




// import {Image, Video, Transformation } from 'cloudinary-react'
// {/* {fileType === "video" && <Video cloudName="dqehfu3kx" effect="progressbar:bar:blue:6" controls publicId={publicId}>
// <Transformation width="150" crop="scale" />
// </Video> } */}