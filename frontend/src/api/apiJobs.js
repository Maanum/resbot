const API_URL = "http://localhost:3001/api/feeds";

const fetchJobs = async () =>
  fetch("http://localhost:3001/api/jobs")
    .then(async (response) => (await response.json()).data)
    .catch((error) => console.error("Error fetching jobs:", error));

export { fetchJobs };
