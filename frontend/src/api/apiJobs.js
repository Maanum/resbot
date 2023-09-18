const fetchJobs = async () =>
  fetch("http://localhost:3001/api/jobs")
    .then(async (response) => (await response.json()).data)
    .catch((error) => console.error("Error fetching jobs:", error));

const updateJob = (jobID, jobData) =>
  fetch(`http://localhost:3001/api/jobs/${jobID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    });

const createJob = (jobData) => {
  return fetch(`http://localhost:3001/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    });
};

export { fetchJobs, updateJob, createJob };
