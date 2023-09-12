import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const FeedDeleteDialog = ({ open, onClose, onConfirm, feed }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete feed "{feed ? feed.name : ""}"?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onConfirm(feed.id);
            onClose();
          }}
        >
          Yes
        </Button>
        <Button onClick={onClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedDeleteDialog;
