import { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';

import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, notesCollection } from './firebase';

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState('');

  //create new state to tempNote, so we will not update note on every keypress
  const [tempNoteText, setTempNoteText] = useState('');

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

  //to pop up recent edited note
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  //sync up our local notes array with the snapshot data
  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    //clean up side effects
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  /**
   * Create an effect that runs any time the tempNoteText changes
   * Delay the sending of the request to Firebase
   *  uses setTimeout
   * use clearTimeout to cancel the timeout
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  //create new note in Firebase
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",

      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    //push note to firestore via addDoc
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  //update note in firebase
  async function updateNote(text) {
    const docRef = doc(db, 'notes', currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
  }

  //delete note in firebase, doc helps us get get access to single document
  async function deleteNote(noteId) {
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {/* {currentNoteId && notes.length > 0 && ( */}
          <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} />
          {/* )} */}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
