import "./App.css";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { ListSubheader } from "@mui/material";

const App = () => {
  const [feeds, setFeeds] = useState([]);
  const [open, setOpen] = useState(false); // For dialog
  const [currentFeed, setCurrentFeed] = useState(null); // Store the feed being edited
  const [title, setTitle] = useState(""); // Temporary state for title
  const [url, setUrl] = useState(""); // Temporary state for URL

  useEffect(() => {
    // Fetch the data when the component mounts
    fetch("http://localhost:3001/api/feeds")
      .then((response) => response.json())
      .then((data) => setFeeds(data.data))
      .catch((error) => console.error("Error fetching feeds:", error));
  }, []); // The empty dependency array means this useEffect will run once when the component mounts

  const handleOpen = (feed) => {
    setTitle(feed.name || "");
    setUrl(feed.url || "");
    setCurrentFeed(feed);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const feedData = {
      name: title,
      url: url,
    };
    if (currentFeed && !currentFeed.isNew) {
      fetch(`http://localhost:3001/api/feeds/${currentFeed.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Update the local state using setFeeds if necessary.
          const updatedFeeds = feeds.map((feed) => {
            if (feed.id === currentFeed.id) {
              return data.data; // Assuming the server returns the updated feed as data in the response.
            }
            return feed;
          });
          setFeeds(updatedFeeds);
        })
        .catch((error) => {
          console.error(
            "There was a problem with the fetch operation:",
            error.message
          );
        });
    } else {
      // Create a new feed (POST request to your API)
      fetch(`http://localhost:3001/api/feeds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Add the newly created feed to the local state using setFeeds.
          setFeeds((prevFeeds) => [...prevFeeds, data.data]); // Assuming the server returns the newly created feed as data in the response.
        })
        .catch((error) => {
          console.error(
            "There was a problem with the fetch operation:",
            error.message
          );
        });
    }
    setOpen(false);
  };

  const handleDelete = (feedId) => {
    fetch(`http://localhost:3001/api/feeds/${feedId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setFeeds((feeds) => feeds.filter((feed) => feed.id !== feedId));
      })
      .catch((error) => {
        console.error("Error deleting feed:", error);
      });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ maxWidth: 1000, margin: "auto" }}
      >
        <Grid item xs={12}>
          <Paper style={{ width: "100%" }}>
            <List>
              <ListSubheader>
                <Grid container alignItems="center" className="noWrapContainer">
                  <Grid item style={{ width: 50 }}>
                    Image
                  </Grid>
                  <Grid item xs>
                    Name & URL
                  </Grid>
                  <Grid item style={{ width: 100, textAlign: "center" }}>
                    Articles
                  </Grid>
                  <Grid item style={{ width: 50 }}>
                    Edit
                  </Grid>
                  <Grid item style={{ width: 50 }}>
                    Delete
                  </Grid>
                </Grid>
              </ListSubheader>
              {feeds.map((feed) => (
                <ListItem key={feed.id}>
                  <Grid
                    container
                    alignItems="center"
                    className="noWrapContainer"
                  >
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
                      <IconButton onClick={() => handleOpen(feed)}>
                        <EditIcon />
                      </IconButton>
                    </Grid>
                    <Grid item style={{ width: 50 }}>
                      <IconButton
                        onClick={() => handleDelete(feed.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen({ isNew: true })}
          >
            Add New Feed
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} fullWidth={true} maxWidth="md" onClose={handleClose}>
        <DialogTitle>Update Feed Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="url"
            label="URL"
            fullWidth
            variant="standard"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default App;
