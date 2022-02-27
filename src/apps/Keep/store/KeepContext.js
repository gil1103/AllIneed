import React, { useState, createContext, useEffect } from 'react';
import { keepService } from './../services/keepService';

export const KeepContext = createContext();

const KeepContextProvider = (props) => {
	const [notes, setNotes] = useState([]);

	useEffect(() => {
		const fetchNotes = async () => {
			const notesData = await keepService.query();
			notesData ? setNotes(notesData) : setNotes([]);
		};
		fetchNotes();
	}, [notes]);

	const addNote = async (type) => {
		const newNote = await keepService.addNewNote(type);
		setNotes([...notes, newNote]);
	};

  // todo complete full crud 

	return (
		<KeepContext.Provider value={{ notes, addNote }}>
			{props.children}
		</KeepContext.Provider>
	);
};

export default KeepContextProvider;
