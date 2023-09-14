const fetchFeeds = async () =>
  fetch("http://localhost:3001/api/feeds")
    .then(async (response) => (await response.json()).data)
    .catch((error) => console.error("Error fetching feeds:", error));

const updateFeed = (feedId, feedData) =>
  fetch(`http://localhost:3001/api/feeds/${feedId}`, {
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
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    });

const createFeed = (feedData) => {
  // Create a new feed (POST request to your API)
  console.log(feedData);
  return fetch(`http://localhost:3001/api/feeds`, {
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
    .catch((error) => {
      console.error(
        "There was a problem with the fetch operation:",
        error.message
      );
    });
};

const deleteFeed = (feedId) => {
  return fetch(`http://localhost:3001/api/feeds/${feedId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return;
    })
    .catch((error) => {
      console.error("Error deleting feed:", error);
    });
};

export { fetchFeeds, updateFeed, createFeed, deleteFeed };
