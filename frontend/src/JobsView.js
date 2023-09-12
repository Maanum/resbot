import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import React, { useState, useEffect } from "react";
import { fetchJobs } from "./api/apiJobs";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs from your API
    fetchJobs().then((data) => setJobs(data));
  }, []);

  return (
    <List>
      {jobs.map((job) => (
        <ListItem key={job.id}>
          Type: {job.type} - CronTime: {job.cronTime}
        </ListItem>
      ))}
    </List>
  );
};

export default Jobs;
