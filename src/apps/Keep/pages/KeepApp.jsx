import React, {useState, useEffect, useRef} from 'react';
// import KeepContextProvider from '../store/KeepContext';
import {NotesList} from "./../cmps/NotesList";
import {Filter} from '../../../cmps/Filter';
import {keepService} from "./../services/keepService";
import {NoteTodo} from '../cmps/NoteTodo';
import {useWindowSize} from '../../../services/useWindowSize';
import {CanvasDrawing} from '../cmps/CanvasDrawing';
import {UploadImage} from '../cmps/UploadImage';
import './KeepApp.css';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import {useClickOutside} from "./../../../cmps/useClickOutside";

export const KeepApp = () => {
    const [notesData, setNotesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [isNewList, setIsNewList] = useState(false);
    const [newNoteData, setNewNoteData] = useState({});
    const [isDetailed, setIsDetailed] = useState(false);
    const [isDrawMenuOpen, setIsDrawMenuOpen] = useState(false);
    const [newNoteId, setNewNoteId] = useState('');
    const [newNoteUploadedImg, setNewNoteUploadedImg] = useState('');
    const [isLoadingImg, setIsLoadingImg] = useState(false);
    const [isDataUpdated, setIsDataUpdated] = useState(true);
    const [scrollToBottom, setScrollToBottom] = useState(false);
    const footerRef = useRef();
    const size = useWindowSize();
    const windowWidth = size.width;
    const newListIconLeftDis = windowWidth > 720 ? 0.58 * windowWidth : 0.56 * windowWidth;
    let searchContainerRef = useClickOutside(() => {
        setIsDrawMenuOpen(false);
    });

    const isImageLoad = ({isLoaded}) => {
        setIsLoadingImg(isLoaded);
    };

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await keepService.query();
            notes ? setNotesData(notes) : setNotesData([]);
        };
        fetchNotes();
    }, [notesData, filteredNotes, isDataUpdated, windowWidth, isLoadingImg, size, searchTerm, isNewList, newNoteData, isDetailed]);

    const isRefreshRequired = (val) => {
        if (val) {
            setIsDataUpdated(false);
            const refreshTimeout = setTimeout(() => {
                setIsDataUpdated(true);
                clearTimeout(refreshTimeout);
            }, 100);
        }
    };

    const hideNewTodo = async (isAddingFinished) => {
        if (isAddingFinished) {
            const notes = await keepService.query();
            notes ? setNotesData(notes) : setNotesData([]);
            setIsNewList(false);
        }
    };

    const searchHandler = async (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const notes = await keepService.filterNotes(searchTerm);
            setFilteredNotes(notes);
        }
    };

    const onAddList = async () => {
        const newList = await keepService.addNewNote('NoteTodo');
        setNewNoteData(newList);
        setIsNewList(true);
        setIsDetailed(true);
    };

    const setDim = (noteDimensions) => {
        console.log('setdim after new note');
    };

    const onAddDraw = async () => {
        if (isDrawMenuOpen) {
            setIsDrawMenuOpen(false);
            return;
        }
        const newNoteWithDraw = await keepService.addNewNote('NoteMedia');
        const {id, canvasDrawing: {uploadedImage}} = newNoteWithDraw;
        setNewNoteId(id);
        setNewNoteUploadedImg(uploadedImage);
        setNewNoteData(newNoteWithDraw);
        setIsDrawMenuOpen(true);
    };

    const updateIsDetailedState = (isTodoDetailed) => {
        setIsDetailed(isTodoDetailed);
        const isNewIncluded = notesData.includes(newNoteData);
        if (isNewIncluded && !isDetailed) hideNewTodo(true);
    };

    const updateNotesList = (notes) => {
        notes ? setNotesData(notes) : setNotesData(notesData);
    };

    const newImgUploaded = async () => {
        setIsDataUpdated(false);
        const scrollTimeout = await setTimeout(() => {
            setScrollToBottom(true);
            clearTimeout(scrollTimeout);
        }, 1000);
        const refreshTimeout = await setTimeout(() => {
            setIsDataUpdated(true);
            clearTimeout(refreshTimeout);
        }, 2000);
    };

    const newCanvasUploaded = (val) => {
        if (val) {
            isRefreshRequired(true);
        }
        const scrollTimeout = setTimeout(() => {
            setScrollToBottom(true);
            clearTimeout(scrollTimeout);
        }, 300);
    };

    const updateIsPinnedStatus = (noteId, isPinned) => {
        const noteIdx = notesData.findIndex(note => note.id === noteId);
        let updatedNotes = [...notesData];
        updatedNotes[noteIdx].isPinned = !isPinned;
        setNotesData(updatedNotes);
        setIsDataUpdated(false);
        const refreshTimeout = setTimeout(() => {
            setIsDataUpdated(true);
            clearTimeout(refreshTimeout);
        }, 1000);
    };
    
    const deleteMediaUpdate=()=>{
        setIsDataUpdated(false);
        const refreshTimeout = setTimeout(() => {
            setIsDataUpdated(true);
            clearTimeout(refreshTimeout);
        }, 1000);
    }

    return (
        <section className="keep-app">
            {/* <KeepContextProvider> */}
            <div ref={searchContainerRef} className="search-container">
                <Tooltip title="New list">
                    <IconButton onClick={onAddList} style={{left: `${ newListIconLeftDis }px`, position: 'absolute'}}>
                        <CheckBoxOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="New note with drawing">
                    <IconButton onClick={onAddDraw} style={{left: `${ windowWidth > 720 ? (newListIconLeftDis + 40) : (newListIconLeftDis + 40) }px`, position: 'absolute'}}>
                        <BrushOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <UploadImage newImgUploaded={newImgUploaded} isBgImage={true} isImageLoad={isImageLoad} newListIconLeftDis={newListIconLeftDis} isMainMenuUpload={true} />
                <Filter term={searchTerm} searchKeyword={searchHandler} isNote={true} newListIconLeftDis={newListIconLeftDis} />
                {newNoteData && isDetailed && <div className="noteOverlay"></div>}
                {isNewList && newNoteData && <NoteTodo note={newNoteData} setNoteDims={setDim} isNewList={isNewList} updateIsDetailedState={updateIsDetailedState} />}
                {isDrawMenuOpen && <div className="noteOverlay" onClick={() => setIsDrawMenuOpen(false)}></div>}
                {newNoteData && isDrawMenuOpen && <CanvasDrawing newCanvasUploaded={newCanvasUploaded} noteId={newNoteId} isDetailed={true} isNewNoteWithDrw={true}
                    uploadedImage={newNoteUploadedImg} isRefreshRequired={isRefreshRequired} />}
            </div>
            {isLoadingImg && <h3>Loading...</h3>}
            {(filteredNotes || notesData) && !isDetailed && !isLoadingImg && isDataUpdated && <NotesList notes={(searchTerm.length > 0) ? filteredNotes : notesData}
                scrollToBottom={scrollToBottom} updateNotesList={updateNotesList} isRefreshRequired={isRefreshRequired}
                updateIsPinnedStatus={updateIsPinnedStatus} deleteMediaUpdate={deleteMediaUpdate} />}
            {isLoadingImg && <div className="notesList-placeholder"></div>}
            <div className="footer" ref={footerRef}></div>
            {/* </KeepContextProvider> */}
        </section>
    );
};
