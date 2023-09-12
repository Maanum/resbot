import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

const FeedEditDialog = ({ open, feed = {}, onClose, onSave }) => {
  const [localTitle, setLocalTitle] = useState("");
  const [localUrl, setLocalUrl] = useState("");

  useEffect(() => {
    setLocalTitle(feed.name || "");
    setLocalUrl(feed.url || "");
  }, [feed]);

  const resetFields = () => {
    setLocalTitle("");
    setLocalUrl("");
  };

  const handleSaveClick = () => {
    onSave({
      name: localTitle,
      url: localUrl,
    });
    resetFields();
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
          onChange={(e) => setLocalTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          id="url"
          label="URL"
          fullWidth
          variant="standard"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveClick}>Save</Button>
        <Button
          onClick={() => {
            onClose();
            resetFields();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedEditDialog;
