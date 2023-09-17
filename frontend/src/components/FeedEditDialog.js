import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { feedSchema } from "common";
import "./FeedEditDialog.css";

const FeedEditDialog = ({ open, feed = {}, onClose, onSave }) => {
  const [localTitle, setLocalTitle] = useState("");
  const [localUrl, setLocalUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (open) {
      // Only reset when the dialog is opened
      setLocalTitle(feed.name || "");
      setLocalUrl(feed.url || "");
      setUrlError(""); // Optionally clear any error messages
      setTitleError(""); // Optionally clear any error messages
    }
  }, [open, feed]);

  const handleSaveClick = () => {
    const inputData = {
      name: localTitle,
      url: localUrl,
    };

    const { error } = feedSchema.validate(inputData);

    if (error) {
      // Check if the error is related to the URL
      if (error.details[0].path[0] === "url") {
        setUrlError(error.details[0].message);
      }
      // If there are other fields, you can handle their errors similarly
      // For example:
      if (error.details[0].path[0] === "name") {
        setTitleError(error.details[0].message);
      }
      return;
    }

    onSave(inputData);
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth="md" onClose={onClose}>
      <DialogTitle>Update Feed Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Title"
          fullWidth
          variant="standard"
          value={localTitle}
          onChange={(e) => {
            setLocalTitle(e.target.value);
            setTitleError(""); // Clear the error when user types
          }}
          error={!!titleError} // If there's an error message, set this to true
          helperText={titleError} // Display the error message here
        />
        <TextField
          margin="dense"
          id="url"
          label="URL"
          fullWidth
          variant="standard"
          value={localUrl}
          onChange={(e) => {
            setLocalUrl(e.target.value);
            setUrlError(""); // Clear the error when user types
          }}
          error={!!urlError} // If there's an error message, set this to true
          helperText={urlError} // Display the error message here
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveClick}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedEditDialog;
