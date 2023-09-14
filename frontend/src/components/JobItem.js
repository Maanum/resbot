import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import cronstrue from "cronstrue";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";

const JobItem = ({ job, onEdit, onDelete, onToggleActive }) => (
  <ListItem disableGutters>
    <Grid container alignItems="center" className="noWrapContainer">
      <Grid item style={{ width: 100 }}>
        {/* <ListItemText
          primary={
            job.type.charAt(0).toUpperCase() + job.type.slice(1).toLowerCase()
          }
        /> */}
        <Chip
          label={job.type}
          color={job.type === "RETRIEVE" ? "primary" : "secondary"}
          style={{ textAlign: "center" }}
        />
      </Grid>
      <Grid item md>
        <ListItemText
          primary={cronstrue.toString(job.cronTime, { verbose: true })}
        />
      </Grid>
      <Grid item md style={{ textAlign: "center" }}>
        <ListItemText primary={job.timezone} />
      </Grid>
      <Grid item style={{ width: 70, textAlign: "center" }}>
        <Switch
          defaultChecked={job.active}
          onChange={(e) => onToggleActive(job, e.target.checked)}
        />
      </Grid>
      <Grid item style={{ width: 50, textAlign: "center" }}>
        <IconButton onClick={() => onEdit(job)}>
          <EditIcon />
        </IconButton>
      </Grid>
      <Grid item style={{ width: 50, textAlign: "center" }}>
        <IconButton onClick={() => onDelete(job)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  </ListItem>
);
export default JobItem;
