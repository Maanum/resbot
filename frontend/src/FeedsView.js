import List from "@mui/material/List";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { ListSubheader } from "@mui/material";
import FeedItem from "./components/FeedItem";
import FeedEditDialog from "./components/FeedEditDialog";
import FeedDeleteDialog from "./components/FeedDeleteDialog";
import { fetchFeeds, updateFeed, createFeed, deleteFeed } from "./api/apiFeeds";
import { feedSchema } from "common";

const FeedsView = () => {
  const [feeds, setFeeds] = useState([]);
  const [open, setOpen] = useState(false); // For dialog
  const [currentFeed, setCurrentFeed] = useState({}); // Store the feed being edited
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [feedToDelete, setFeedToDelete] = useState(null);

  useEffect(() => {
    fetchFeeds().then((data) => setFeeds(data));
  }, []);

  const handleOpen = (feed) => {
    setCurrentFeed(feed);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (feedData) => {
    // Validate using Joi
    const { error } = feedSchema.validate(feedData);

    if (error) {
      // Handle the validation error, maybe show a user-friendly message
      alert(error.details[0].message); // For simplicity, using an alert. Consider a better UX approach.
      return;
    }
    if (currentFeed && !currentFeed.isNew) {
      await updateFeed(currentFeed.id, feedData);
    } else {
      await createFeed(feedData);
    }
    const freshFeeds = await fetchFeeds();
    setFeeds(freshFeeds);
    setOpen(false);
  };

  const handleDelete = async (feedId) => {
    await deleteFeed(feedId);
    setDeleteConfirmOpen(false);
    const freshFeeds = await fetchFeeds();
    setFeeds(freshFeeds);
  };

  const handleDeletePrompt = (feed) => {
    setFeedToDelete(feed);
    setDeleteConfirmOpen(true);
  };

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <List style={{ width: "100%" }}>
            <ListSubheader disableGutters>
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
              <FeedItem
                feed={feed}
                onEdit={handleOpen}
                onDelete={handleDeletePrompt}
                key={feed.id}
              />
            ))}
          </List>
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
      <FeedEditDialog
        open={open}
        feed={currentFeed}
        onClose={handleClose}
        onSave={handleSave}
      />
      <FeedDeleteDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        feed={feedToDelete}
      />
    </>
  );
};

export default FeedsView;
