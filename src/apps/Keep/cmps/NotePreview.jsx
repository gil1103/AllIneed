import React, {useState, useEffect, useCallback} from 'react';
import {NoteTodo} from "./NoteTodo";
import './NotePreview.css';
import {useWindowSize} from "./../../../services/useWindowSize";

export const NotePreview = React.forwardRef((props, ref) => {
  const {note, updateLeftMargin, updateNotesList, pinnedNoteIdx, notPinnedNoteIdx, callbackNoteDim, pinnedNoteHeight, unpinnedNoteHeight, scrollNoteToView, updateIsPinnedStatus, deleteMediaUpdate} = props;
  const [isDetailed, setIsDetailed] = useState(false);
  const [noteDimentions, setNoteDimentions] = useState();
  const [pinnedRowStackHeight, setPinnedRowStackHeight] = useState();
  const [unpinnedRowStackHeight, setUnpinnedRowStackHeight] = useState();
  const [translateX, setTranslateX] = useState();
  const [translateY, setTranslateY] = useState();
  const size = useWindowSize();
  const windowWidth = size.width;
  const itemsPerRow = 3;
  const pinnedNotesTopMargin = 40;
  const unpinnedNotesTopMargin = 40;
  const horizontalGap = Math.round(windowWidth/13);
  // const {type} = note; //todo add filter by type
  // const {isPinned} = note;
  const pinnedRowsCount = Math.ceil((pinnedNoteIdx + 1) / itemsPerRow); //starts at 1
  const unpinnedRowsCount = Math.ceil((notPinnedNoteIdx + 1) / itemsPerRow); //starts at 1
  const pinnedColumnCount = (pinnedNoteIdx) % itemsPerRow;
  const unpinnedColumnCount = (notPinnedNoteIdx) % itemsPerRow;
  const marginLeft = 1.2*(0.5 * (windowWidth - ((itemsPerRow * noteDimentions?.noteWidth) + (horizontalGap * (itemsPerRow - 1)))));

  const calculateTransX = useCallback(() => {
    if (note.isPinned) {
      return `${ marginLeft + ((pinnedColumnCount * (noteDimentions?.noteWidth + horizontalGap)) - (horizontalGap / 2)) }px`;
    } else if (!note.isPinned) {
      return `${ marginLeft + ((unpinnedColumnCount * (noteDimentions?.noteWidth + horizontalGap)) - (horizontalGap / 2)) }px`;
    }
  }, [note, marginLeft, pinnedColumnCount, unpinnedColumnCount, noteDimentions, horizontalGap]);

  const calculateTransY = useCallback(() => {
    if (note.isPinned) {
      return `${ (pinnedNoteIdx < itemsPerRow) ? pinnedNotesTopMargin : pinnedNotesTopMargin + pinnedRowStackHeight }px`;
    }
    else if (!note.isPinned) {
      return `${ (notPinnedNoteIdx < itemsPerRow) ? unpinnedNotesTopMargin : unpinnedNotesTopMargin + unpinnedRowStackHeight }px`;
    }
  }, [note, pinnedNoteIdx, notPinnedNoteIdx, pinnedRowStackHeight, unpinnedRowStackHeight ]);

  useEffect(() => {
    updateLeftMargin(marginLeft);
    if (pinnedNoteHeight) {
      setPinnedRowStackHeight(pinnedNoteHeight + (pinnedRowsCount - 1) * 20);
    }
    if (unpinnedNoteHeight) {
      setUnpinnedRowStackHeight(unpinnedNoteHeight + (unpinnedRowsCount - 1) * 20);
    }
    setTranslateX(calculateTransX());
    setTranslateY(calculateTransY());

  }, [isDetailed, updateLeftMargin, pinnedRowsCount, unpinnedRowsCount, unpinnedRowStackHeight, pinnedRowStackHeight, pinnedNoteIdx, callbackNoteDim, notPinnedNoteIdx, calculateTransY, calculateTransX, translateY, translateX, marginLeft, pinnedNoteHeight, unpinnedNoteHeight, note, noteDimentions]);

  const updateIsDetailedState = (isTodoDetailed) => {
    setIsDetailed(isTodoDetailed);
  };

  const setDim = (noteDimensions) => {
    callbackNoteDim(noteDimensions);
    setNoteDimentions(noteDimensions);
  };

  return (
    <>
      <section ref={ref} className={`note-preview ${ isDetailed ? 'detailed' : '' }`} style={{transform: `translate(${ translateX }, ${ translateY } )`}}>
        {isDetailed && <div className="noteOverlay"></div>}
        <NoteTodo note={note} updateIsDetailedState={updateIsDetailedState} updateNotesList={updateNotesList}
          setNoteDims={setDim} scrollNoteToView={scrollNoteToView} 
          updateIsPinnedStatus={updateIsPinnedStatus} deleteMediaUpdate={deleteMediaUpdate}
        />
      </section>
    </>
  );
});
