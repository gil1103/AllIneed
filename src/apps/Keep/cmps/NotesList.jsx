import React, {useState, useRef, useEffect, useCallback} from 'react';
// import {KeepContext} from '../store/KeepContext';
import {NotePreview} from "./NotePreview";
import './NotesList.css';

export const NotesList = (props) => {
  // const {notes} = useContext(KeepContext);
  const {notes, updateNotesList, isRefreshRequired, scrollToBottom, updateIsPinnedStatus, deleteMediaUpdate} = props;
  const [pinnedContainerHeight, setPinnedContainerHeight] = useState();
  const [unpinnedContainerHeight, setUnpinnedContainerHeight] = useState();
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [unpinnedNotes, setUnpinnedNotes] = useState([]);
  const [pinnedHeightArr, setPinnedHeightArr] = useState([]);
  const [unpinnedHeightArr, setUnpinnedHeightArr] = useState([]);
  const [marginLeft, setMarginLeft] = useState();
  const pinnedNotesRefs = useRef([]);
  const unpinnedNotesRefs = useRef([]);
  const endRef = useRef();
  const notesListHeight = pinnedContainerHeight + unpinnedContainerHeight + 140;

  let pinnedHeights = [];
  let unpinnedHeights = [];
  const callbackNoteDim = (index, dim, isPinnedList) => {
    const obj = {index, noteHeight: dim.noteHeight};
    if (isPinnedList) {
      pinnedHeights.push(obj);
      if (pinnedHeights.length === pinnedNotes.length && pinnedHeights.length > 0) {
        setPinnedContainerHeight(calculateStackHeight(pinnedHeights, 3, true));
      }
    } else {
      unpinnedHeights.push(obj);
      if (unpinnedHeights.length === unpinnedNotes.length && unpinnedHeights.length > 0) {
        setUnpinnedContainerHeight(calculateStackHeight(unpinnedHeights, 3, false));
      }
    }
  };

  const scrollToBtmRef = async () => {
    const scrollTimeout = await setTimeout(() => {
      endRef.current?.scrollIntoView({behavior: 'smooth'});
      clearTimeout(scrollTimeout);
    }, 300);
  };

  if (scrollToBottom) scrollToBtmRef();

  const calculateStackHeight = (arr, maxItemsInRow, isPinned) => {
    let colIdx = 0;
    let finishedCol = 0;
    let stackHeightArr = [];
    let preRowItemIdx = 0;
    let stackingH;
    const TotalRowsCount = Math.ceil(arr.length / maxItemsInRow);//start at 1
    for (let rowIdx = 0; rowIdx < TotalRowsCount; rowIdx++) {
      colIdx = rowIdx * maxItemsInRow;
      finishedCol = colIdx + maxItemsInRow;
      finishedCol = finishedCol > arr.length ? arr.length : finishedCol;
      for (colIdx; colIdx < finishedCol; colIdx++) {
        let noteHeight = arr[colIdx]?.noteHeight;
        if (noteHeight && noteHeight !== null) {
          if (colIdx < maxItemsInRow) {
            stackingH = 0;
          } else {
            // columnCount=colIdx % maxItemsInRow;
            preRowItemIdx = colIdx - maxItemsInRow;
            stackingH = stackHeightArr[preRowItemIdx].stackingH + stackHeightArr[preRowItemIdx].noteHeight;
          }
          stackHeightArr.push({index: colIdx, stackingH, noteHeight});
        }
        if ((rowIdx === TotalRowsCount - 1) && (colIdx === arr.length - 1)) {
          isPinned ? setPinnedHeightArr(stackHeightArr) : setUnpinnedHeightArr(stackHeightArr);//todo:update setPinnedHeightArr/setUnpinnedHeightArr names
          const maxStackHeightObj = stackHeightArr.reduce((prev, current) => {
            return (((prev.stackingH + prev.noteHeight) > (current.stackingH + current.noteHeight)) ? prev : current);
          }, 1);
          const maxStackHeight = maxStackHeightObj.stackingH + maxStackHeightObj.noteHeight;
          return maxStackHeight + (32 * (rowIdx + 1));
        }
      }
    }
  };

  const filterNotes = useCallback(() => {
    const filteredPinned = notes.filter(note => {
      return note.isPinned;
    });
    filteredPinned ? setPinnedNotes(filteredPinned) : setPinnedNotes([]);
    const filteredUnpinned = notes.filter(note => {
      return !note.isPinned;
    });
    filteredUnpinned ? setUnpinnedNotes(filteredUnpinned) : setUnpinnedNotes([]);
  }, [notes]);

  useEffect(() => {
    filterNotes();
  }, [notes, filterNotes, marginLeft, unpinnedHeightArr, scrollToBottom]);

  
  const handleScroll = async (index, isPinnedRef) => {
    if (isPinnedRef) {
      pinnedNotesRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      unpinnedNotesRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    const scrollTimeout = await setTimeout(() => {
      isRefreshRequired(true);
      clearTimeout(scrollTimeout);
    }, 1200);
  };

  return (
    <section >
      <div className="notes-list" style={{height: `${ notesListHeight }px`}}>
        {pinnedNotes.length > 0 && <h1 className="pinned-title" style={{left: `${ marginLeft }px`}}>PINNED</h1>}
        <div className="pinnedNote-container" >
          {pinnedNotes.map((note, index) => {
            const pinnedNoteHeight = pinnedHeightArr[index]?.stackingH;
            return (
              <NotePreview key={note.id} ref={(el) => {pinnedNotesRefs.current[index] = el;}}
                scrollNoteToView={() => handleScroll(index, true)}
                callbackNoteDim={(dim) => callbackNoteDim(index, dim, true)}
                updateLeftMargin={(val) => setMarginLeft(val)}
                pinnedNoteIdx={index} note={note} updateNotesList={updateNotesList}
                pinnedNoteHeight={pinnedNoteHeight} deleteMediaUpdate={deleteMediaUpdate}
                updateIsPinnedStatus={updateIsPinnedStatus} />
            );
          })}
        </div>
        {unpinnedNotes.length > 0 && <h1 className="unpinned-title"
          style={{transform: `translate(${ marginLeft }px, ${ pinnedContainerHeight }px)`}} >OTHERS</h1>}
        <div className="unpinnedNote-container"
          style={{transform: `translate(${ 0 }px, ${ pinnedContainerHeight }px)`}}>
          {unpinnedNotes.map((note, index) => {
            const unpinnedNoteHeight = unpinnedHeightArr[index]?.stackingH;
            return (
              <NotePreview key={note.id} ref={(el) => {unpinnedNotesRefs.current[index] = el;}}
                scrollNoteToView={() => handleScroll(index, false)}
                callbackNoteDim={(dim) => callbackNoteDim(index, dim, false)}
                updateLeftMargin={(val) => setMarginLeft(val)}
                notPinnedNoteIdx={index} note={note} updateNotesList={updateNotesList}
                unpinnedNoteHeight={unpinnedNoteHeight} deleteMediaUpdate={deleteMediaUpdate}
                updateIsPinnedStatus={updateIsPinnedStatus} />
                );
          })}
        </div>
      </div>
      <div className="endRef" ref={endRef}></div>
    </section>
  );
};


/* <section >
  <h1>PINNED</h1>
  <div className="notes-list">
  {pinnedNotes.map(note => {
      return (
        <NotePreview key={note.id} note={note} updateNotesList={updateNotesList} />
        );
    })}
  </div>
  <h1>OTHERS</h1>
  <div className="notes-list">
  {notPinnedNotes.map(note => {
      return (
        <NotePreview key={note.id} note={note} updateNotesList={updateNotesList} />
      );
    })}
    </div>
</section> */


// const filteredPinned = notes.filter(note => {
  //   return note.isPinned;
  // });
// console.log(filteredPinned);
// filteredPinned ? setPinnedNotes(filteredPinned) : setPinnedNotes([]);
// const filteredUnpinned = notes.filter(note => {
  //   return !note.isPinned;
// });
// filteredUnpinned ? setUnpinnedNotes(filteredUnpinned) : setUnpinnedNotes([]);
// const updateNotes = useCallback(() => {
  //   setPinnedNotes(notes.filter(note => note.isPinned));
//   setUnpinnedNotes(notes.filter(note => !note.isPinned));
// }, [notes]);
// updateNotes();

// const calculateStackingHeight = (arr, maxItemsInRow,isPinned) => {
//   console.log(arr);
//   let rowMaxHeight = 0;
//   let stackingHeight = 0;
//   let colIdx = 0;
//   let finishedCol = 0;
//   let maxHeightArr=[]
//   const TotalRowsCount = Math.ceil(arr.length / maxItemsInRow);
//   for (let rowIdx = 0; rowIdx < TotalRowsCount; rowIdx++) {
  //     stackingHeight += rowMaxHeight;
//     if (rowMaxHeight > 0) {
//       maxHeightArr.push({rowIdx: rowIdx ,prevRowMaxHeight :rowMaxHeight, prevRowsStack:stackingHeight})
//     }
//     rowMaxHeight = 0;
//     colIdx = rowIdx * maxItemsInRow;
//     finishedCol = colIdx + maxItemsInRow;
//     finishedCol = finishedCol > arr.length ? arr.length : finishedCol;
//     console.log('colIdx', colIdx, 'finishedCol', finishedCol);
//     for (colIdx; colIdx < finishedCol; colIdx++) {
//       console.log('arr[colIdx]', arr[colIdx]);
//       let noteHeight = arr[colIdx]?.noteHeight;
//       if (noteHeight && noteHeight !== null) {
  //         rowMaxHeight = noteHeight > rowMaxHeight ? noteHeight : rowMaxHeight;
//       }
//       if ((rowIdx === TotalRowsCount - 1) && (colIdx === arr.length - 1)) {
//         // maxHeightArr.push({rowIdx, rowMaxHeight})
//         isPinned ? setPinnedRowsMaxHeightArr(maxHeightArr) : setUnpinnedRowsMaxHeightArr(maxHeightArr)
//         return stackingHeight + rowMaxHeight + (32 * (rowIdx+1));
//       }
//     }
//   }
// };

// const updateIsPinnedStatus = (noteId, isPinned) => {
//   console.log('isPinned',isPinned,'noteId',noteId);
//   if (isPinned) {
//     const noteIdx = pinnedNotes.findIndex(note => note.id === noteId);
//     let updatedUnpinnedNotes = [...unpinnedNotes];
//     updatedUnpinnedNotes = [...updatedUnpinnedNotes, pinnedNotes[noteIdx]];
//     setUnpinnedNotes(updatedUnpinnedNotes);
//     const removedItem=pinnedHeights.find(obj=>obj.index===noteIdx)
//     pinnedHeights=pinnedHeights.filter(obj=>obj.index!==noteIdx)
//     setPinnedContainerHeight(calculateStackHeight(pinnedHeights, 3, true))

//     let updatedPinnedNotes = [...pinnedNotes];
//     updatedPinnedNotes = updatedPinnedNotes.filter(note => note.id !== noteId);
//     setPinnedNotes(updatedPinnedNotes);
//     removedItem.index=unpinnedHeights.length;
//     unpinnedHeights.push(removedItem)
//     setUnpinnedContainerHeight(calculateStackHeight(unpinnedHeights, 3, false));
//   } else {
//     const noteIdx = unpinnedNotes.findIndex(note => note.id === noteId);
//     let updatedpinnedNotes = [...pinnedNotes];
//     updatedpinnedNotes = [...updatedpinnedNotes, unpinnedNotes[noteIdx]];
//     setPinnedNotes(updatedpinnedNotes);
//     // const removedItem = unpinnedHeights.find(obj => obj.index === noteIdx)
//     // unpinnedHeights = unpinnedHeights.filter(obj => obj.index !== noteIdx)
//     // setUnpinnedContainerHeight(calculateStackHeight(unpinnedHeights, 3, false));

//     let updatedUnpinnedNotes = [...unpinnedNotes];
//     updatedUnpinnedNotes = updatedUnpinnedNotes.filter(note => note.id !== noteId);
//     setUnpinnedNotes(updatedUnpinnedNotes);
//     // removedItem.index = pinnedHeights.length;
//     // pinnedHeights.push(removedItem)
//     // setPinnedContainerHeight(calculateStackHeight(pinnedHeights, 3, true))
//   }
// };