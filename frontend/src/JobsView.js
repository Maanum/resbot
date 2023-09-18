import List from "@mui/material/List";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ListSubheader } from "@mui/material";
import JobItem from "./components/JobItem";
import { fetchJobs, updateJob, createJob } from "./api/apiJobs";
import { jobSchema } from "common";
import JobEditDialog from "./components/JobEditDialog";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    // Fetch jobs from your API
    fetchJobs().then((data) => setJobs(data));
  }, []);

  const handleOpen = (job) => {
    setCurrentJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (jobData) => {
    const { error } = jobSchema.validate(jobData);
    if (error) {
      alert(error.details[0].message);
      return;
    }

    if (currentJob && !currentJob.isNew) {
      await updateJob(currentJob.id, jobData);
    } else {
      await createJob(jobData);
    }
    const freshJobs = await fetchJobs();
    setJobs(freshJobs);
    setOpen(false);
  };

  const handleDeletePrompt = (job) => {
    setJobToDelete(job);
    setDeleteConfirmOpen(true);
  };

  const handleToggleActive = async (job, isActive) => {
    // Make an API call here
    await updateJob(job.id, { ...job, active: isActive });
    const freshJobs = await fetchJobs();
    setJobs(freshJobs);
  };

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <List style={{ width: "100%" }}>
            <ListSubheader disableGutters>
              <Grid container alignItems="center" className="noWrapContainer">
                <Grid item style={{ width: 100 }}>
                  Type
                </Grid>
                <Grid item md>
                  Frequency
                </Grid>
                <Grid item md style={{ textAlign: "center" }}>
                  Time Zone
                </Grid>
                <Grid item style={{ width: 70, textAlign: "center" }}>
                  Active
                </Grid>
                <Grid item style={{ width: 50, textAlign: "center" }}>
                  Edit
                </Grid>
                <Grid item style={{ width: 50, textAlign: "center" }}>
                  Delete
                </Grid>
              </Grid>
            </ListSubheader>
            {jobs.map((job) => (
              <JobItem
                job={job}
                onEdit={handleOpen}
                onDelete={handleDeletePrompt}
                onToggleActive={handleToggleActive}
                key={job.id}
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
            Add New Job
          </Button>
        </Grid>
      </Grid>
      <JobEditDialog
        open={open}
        job={currentJob}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

export default Jobs;

// const handleDelete = async (jobId) => {
//   await deleteJob(jobId);
//   setDeleteConfirmOpen(false);
//   const freshJobs = await fetchJobs();
//   setJobs(freshJobs);
// };

// <JobDeleteDialog
//   open={deleteConfirmOpen}
//   onClose={() => setDeleteConfirmOpen(false)}
//   onConfirm={handleDelete}
//   Job={jobToDelete}
// />
