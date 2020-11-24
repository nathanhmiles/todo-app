import React, { useState, useEffect, useContext } from "react";
import { Route, useHistory } from "react-router-dom";
import CreateArea from "../layout/CreateArea";
import Note from "../layout/Note";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import UserContext from "../../context/UserContext";
import NotificationContext from "../../context/NotificationContext";

const useStyles = makeStyles(theme => ({
  root: {
    flexgrow: 1,
  },
  note: {
    padding: theme.spacing(2),
  }
}));

export default function NotePage() {
  const classes = useStyles();
  // Keeps track of all saved notes
  const [notes, setNotes] = useState();
  const { userData } = useContext(UserContext);
  const {notification, setNotification} = useContext(NotificationContext);
  const token = localStorage.getItem("auth-token");
  const history = useHistory();

  // Load all notes from DB on mount + when notes/token update
  useEffect(() => {
    // Send user to login if not logged in
    if (!userData.user) {
      setNotification({severity: "error", message: "Please login"});
      history.push("/");
    } 

    // Using an IIFE to carry out an async func within useEffect
    (async function getNotes() {
      try {
        const dbNotes = await axios.get(
          "/api/notes/", 
          {headers: {"x-auth-token": token }}
        );
        setNotes(dbNotes.data);
      } catch(err) {
        console.log("Error: " + err);
      }
    })();
  }, [token, userData, history]);

  // Add new note from the Create Area
  function addNote(newNote) {
    setNotes(prevNotes => {
      return (
        [...prevNotes, newNote]
      )
    })
  }

  // Delete note from the saved notes
  async function deleteNote(id) {
    try {
      // Delete note from database
      const deletedNote = await axios.delete(
        `/api/notes/${id}`, 
        {headers: {"x-auth-token": token}}
      );
      console.log(deletedNote.data);
    } catch(err) { 
      console.log("Error: " + err);
    }

    // Delete note from state
    setNotes(prevNotes => {
      return prevNotes.filter(note => note._id !== id);
    });
  }

  return (
    <Route path="/notes">
    <div className={classes.root}>
        <Grid container justify="center" spacing={2}>
            <CreateArea
              onAdd={addNote}
            />
        </Grid>
      <Grid container spacing={2}>
        {notes && notes.map((note) => { return (
          <Note 
            key={note._id}
            id={note._id}
            title={note.title}
            content={note.content}
            onDelete={deleteNote}
          />
        )})}
        </Grid>
      </div>
    </Route>

  )
}
