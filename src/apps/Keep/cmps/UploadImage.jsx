import React, {useState, useEffect} from 'react';
import {keepService} from "../services/keepService";
import Tooltip from '@mui/material/Tooltip';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import IconButton from '@mui/material/IconButton';
import {useWindowSize} from "./../../../services/useWindowSize";
import './UploadImage.css';

export const UploadImage = ({noteId, isImageLoad, isBgImage, isMainMenuUpload, newListIconLeftDis, newImgUploaded}) => {
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');
  const [isNewImgUploaded, setIsNewImgUploaded] = useState(false);
  const size = useWindowSize();
  const windowWidth = size.width;

  useEffect(() => {
    const uploadedImgStatus = {
      isLoaded: isLoadingImg,
      file: uploadedFile
    };
    isImageLoad(uploadedImgStatus);
  }, [isLoadingImg, uploadedFile, isImageLoad]);

  useEffect(() => {
  }, [noteId, isImageLoad]);

  const onUploadImage = async (e) => {
    try {
      setIsLoadingImg(true);
      const files = e.target.files;
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('upload_preset', 'keepapp');
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dqehfu3kx/auto/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const file = await res.json();
      setUploadedFile(file);

      const imageType = isBgImage ? "isBgImage" : "isCanvasUploaded";

      if (noteId) {
        await keepService.uploadImage(file, noteId, imageType);
      } else {
        const newNote = await keepService.addNewNote('NoteMedia');
        await keepService.uploadImage(file, newNote.id, imageType);
        setIsNewImgUploaded(true)
      }
      setIsLoadingImg(false);
      if (isNewImgUploaded) newImgUploaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`image-upload ${ isMainMenuUpload ? "onMainMenu" : "" }`}
      style={{left: `${ windowWidth > 720 ? (newListIconLeftDis + 75) : (newListIconLeftDis + 75) }px`}}>
      <Tooltip title="Upload media">
        <IconButton>
          <label htmlFor={`${ isMainMenuUpload ? "directFile-input" : "file-input" }`}>
            <CloudUploadOutlinedIcon />
          </label>
        </IconButton>
      </Tooltip>

      <input style={{width: 0, height: 0}} id={`${ isMainMenuUpload ? "directFile-input" : "file-input" }`} type="file"
        onChange={onUploadImage}  />
    </div>
  );
};
