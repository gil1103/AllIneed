import React, {useState, useRef, useEffect, useCallback} from 'react';
import {UploadImage} from './UploadImage';
import CanvasDraw from "react-canvas-draw";
import {keepService} from '../services/keepService';
import {useWindowSize} from '../../../services/useWindowSize';
import './CanvasDrawing.css';
import {BsEraserFill} from "react-icons/bs";
import {ImUndo2} from "react-icons/im";
import {AiFillPicture} from "react-icons/ai";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {makeStyles} from "@material-ui/core/styles";

// import {useIsMobileOrTablet} from "./../../../services/isMobileOrTablet";

export const CanvasDrawing = ({noteId, isDetailed, isNewNoteWithDrw, uploadedImage, scrollCanvasToView, newCanvasUploaded, isRefreshRequired}) => {
  const [isUploadShown, setIsUploadShown] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [newNoteWithDraw, setNewNoteWithDraw] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const [imgSrc, setImgSrc] = useState('');
  const size = useWindowSize();
  const drawingContainerRef = useRef(null);

  const canvasLeftMargin = windowWidth > 720 ? 0.5 * (windowWidth - canvasWidth) : 0;

  const isImageLoad = useCallback(({isLoaded, file}) => {
    setIsLoadingImg(isLoaded);
    file ? setUploadedFile(file.url) : setUploadedFile(uploadedFile);
  }, [uploadedFile]);

  const calculateCanvasWidth = useCallback(() => {
    let width;
    if (windowWidth > 720) {
      width = isNewNoteWithDrw ? 500 : 300;
    } else {
      width = drawingContainerRef.current.clientWidth;
    }
    return width;
  }, [windowWidth,isNewNoteWithDrw, drawingContainerRef]);

  useEffect(() => {
    setWindowWidth(size.width);
    setCanvasWidth(calculateCanvasWidth());
    setNewNoteWithDraw(isNewNoteWithDrw);
    uploadedImage ? setImgSrc(uploadedImage) : setImgSrc(uploadedFile);
    imgSrc ? setIsUploadShown(false) : setIsUploadShown(isUploadShown);
  }, [isLoadingImg, imgSrc, size.width, canvasWidth, calculateCanvasWidth, uploadedImage, uploadedFile, isImageLoad, isUploadShown, noteId, isNewNoteWithDrw]);

  const useStyles = makeStyles(theme => ({
    customHover: {
      "&:hover, &.Mui-focusVisible": {borderRadius: '0'}
    }
  }));
  const classes = useStyles();

  // const isMobOrTab = useIsMobileOrTablet();
  const canvasRef = useRef();

  const handleChange = async (ev) => {
    const drawing = canvasRef.current.getDataURL();
    const imageType = 'canvasDrawing';
    await keepService.uploadImage(drawing, noteId, imageType);
    if (isNewNoteWithDrw) {
      const reloadTimeout = setTimeout(() => {
        isRefreshRequired(true);
      }, 500);
      newCanvasUploaded(true);
      clearTimeout(reloadTimeout);
    }
    else {
      const reloadTimeout = await setTimeout(() => {
        scrollCanvasToView();
        clearTimeout(reloadTimeout);
      }, 5000);
    }
  };

  const onInsertUrl = async (e) => {
    const imageUrl = e.target.value;
    const imageType = 'imageUrl';

    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', 'keepapp');
    setIsLoadingImg(true);
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dqehfu3kx/auto/upload',
      {
        method: 'POST',
        body: formData,
        header: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Header': 'Origin',
          'Access-Control-Allow-Credentials': true
        }
      }
    );
    const file = await res.json();
    setUploadedFile(file.url);
    await keepService.uploadImage(file, noteId, imageType);
    setIsLoadingImg(false);
  };

  const erase = () => {
    canvasRef.current.eraseAll();
  };

  const undoLast = () => {
    canvasRef.current.undo();
  };

  const openUploadMenu = () => {
    setIsUploadShown(true);
  };

  return (
    <div className={`canvasDrawing-container ${ isDetailed ? "detailed" : "" }`}
      ref={drawingContainerRef}
      style={{
        top: `${ isNewNoteWithDrw ? '0' : '-200' }px`,
        left: `${ isNewNoteWithDrw ? canvasLeftMargin : '0' }px`,
        width: `${ windowWidth < 720 ? "100%" : '' }`
      }}>
      {/* <p>
        Use your {isMobOrTab ? "finger" : "mouse"} to draw{" "}
      </p> */}
      {!isUploadShown && <div>
        <Tooltip title="Erase">
          <IconButton className={classes.customHover} onClick={erase}>
            <BsEraserFill />
          </IconButton>
        </Tooltip>
        <Tooltip title="Undo">
          <IconButton className={classes.customHover} onClick={undoLast}>
            <ImUndo2 />
          </IconButton>
        </Tooltip>
        <Tooltip title="Upload background image">
          <IconButton className={classes.customHover} onClick={openUploadMenu}>
            <AiFillPicture />
          </IconButton>
        </Tooltip>
      </div>}


      {isUploadShown && <div className="uploadMenu-container">
        <UploadImage noteId={noteId} isBgImage={false} isCanvas={true} newNoteWithDrw={newNoteWithDraw}
          isImageLoad={isImageLoad} />
        <input type="url" placeholder="insert image Url" id="image-input" onChange={onInsertUrl} />
      </div>}
      {isLoadingImg && <h3>Loading...</h3>}

      <CanvasDraw
        canvasWidth={canvasWidth}
        canvasHeight={200}
        lazyRadius={0}
        brushRadius={1}
        brushColor={"#444"}
        onChange={handleChange}
        enablePanAndZoom
        hideGrid={true}
        ref={canvasRef}
        saveData={localStorage.setItem("savedImage", canvasRef.current?.getSaveData())}
        imgSrc={imgSrc}
        style={{
          boxShadow:
            "0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)",
        }}
      />
    </div >
  );
};
