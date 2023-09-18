import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { jobSchema } from "common";

const JobEditDialog = ({ open, job = {}, onClose, onSave }) => {
  const [localCrontime, setLocalCrontime] = useState("");
  const [localTimezone, setLocalTimezone] = useState("");
  const [localType, setLocalType] = useState("");
  const [crontimeError, setCrontimeError] = useState("");
  const [timezoneError, setTimezoneError] = useState("");
  const [typeError, setTypeError] = useState("");

  useEffect(() => {
    if (open) {
      // Only reset when the dialog is opened
      setLocalCrontime(job.cronTime || "");
      setLocalTimezone(job.timezone || "");
      setLocalType(job.type || "");
      setCrontimeError("");
      setTimezoneError("");
      setTypeError("");
    }
  }, [open, job]);

  const handleSaveClick = () => {
    const inputData = {
      cronTime: localCrontime,
      timezone: localTimezone,
      type: localType,
    };

    const { error } = jobSchema.validate(inputData);

    if (error) {
      if (error.details[0].path[0] === "cronTime") {
        setCrontimeError(error.details[0].message);
      }
      if (error.details[0].path[0] === "timezone") {
        setTimezoneError("Must be a valid timezone");
      }
      if (error.details[0].path[0] === "type") {
        setTypeError(error.details[0].message);
      }
      return;
    }

    onSave(inputData);
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth="md" onClose={onClose}>
      <DialogTitle>Update job Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="crontime"
          label="Crontime"
          fullWidth
          variant="standard"
          value={localCrontime}
          onChange={(e) => {
            setLocalCrontime(e.target.value);
            setCrontimeError(""); // Clear the error when user types
          }}
          error={!!crontimeError} // If there's an error message, set this to true
          helperText={crontimeError} // Display the error message here
        />
        <TextField
          margin="dense"
          id="timezone"
          label="Timezone"
          fullWidth
          variant="standard"
          value={localTimezone}
          onChange={(e) => {
            setLocalTimezone(e.target.value);
            setTimezoneError(""); // Clear the error when user types
          }}
          error={!!timezoneError} // If there's an error message, set this to true
          helperText={timezoneError} // Display the error message here
        />
        <TextField
          margin="dense"
          id="type"
          label="type"
          fullWidth
          variant="standard"
          value={localType}
          onChange={(e) => {
            setLocalType(e.target.value);
            setTypeError(""); // Clear the error when user types
          }}
          error={!!typeError} // If there's an error message, set this to true
          helperText={typeError} // Display the error message here
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveClick}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobEditDialog;
