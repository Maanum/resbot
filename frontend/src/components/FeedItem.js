import React from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import "./FeedItem.css";

const FeedItem = ({ feed, onEdit, onDelete }) => (
  <ListItem>
    <Grid container alignItems="center" className="noWrapContainer">
      <Grid item style={{ width: 50 }}>
        <Avatar alt="Page Favicon" src={feed.icon} />
      </Grid>
      <Grid item xs>
        <ListItemText primary={feed.name} secondary={feed.url} />
      </Grid>
      <Grid item style={{ width: 100, textAlign: "center" }}>
        <ListItemText primary={`TBD`} />
      </Grid>
      <Grid item style={{ width: 50 }}>
        <IconButton onClick={() => onEdit(feed)}>
          <EditIcon />
        </IconButton>
      </Grid>
      <Grid item style={{ width: 50 }}>
        <IconButton onClick={() => onDelete(feed)} color="secondary">
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  </ListItem>
);

export default FeedItem;
