import "./App.css";
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Feeds from "./FeedsView";
import Jobs from "./JobsView";

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="appWrapper">
      <Typography variant="h3" sx={{ lineHeight: 2, m: 1 }}>
        📚ResBot
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedTab} onChange={handleChangeTab}>
          <Tab label="Feeds" />
          <Tab label="Jobs" />
        </Tabs>
      </Box>
      {selectedTab === 0 && <Feeds />}
      {selectedTab === 1 && <Jobs />}
    </div>
  );
};

export default App;
