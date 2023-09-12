import "./App.css";
import React, { useState, useEffect } from "react";
import { Tabs, Tab, AppBar } from "@mui/material";
import Feeds from "./FeedsView";
import Jobs from "./JobsView";

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0); // New state for tabs

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          variant="fullWidth"
        >
          <Tab label="Feeds" />
          <Tab label="Jobs" />
        </Tabs>
      </AppBar>
      {selectedTab === 0 && <Feeds />}
      {selectedTab === 1 && <Jobs />}
    </div>
  );
};

export default App;
