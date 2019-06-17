import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";

import EDMHome from "./components/edm/edm-home/EDMHome";
import CreateEDM from "./components/edm/create-edm/CreateEDM";
import EditEDM from "./components/edm/edit-edm/EditEDM";
import ConvertCSV from "./components/gmt/g66/ConvertCSV";
import ComplaintReport from "./components/gmt/h54/ComplaintReport";

import VideoRanking from "./components/youtube/VideoRanking";
import NotFound from "./components/layout/NotFound";

import Monthly from "./components/youtube/report/Monthly";
import DailyChart from "./components/youtube/report/DailyChart";

import ChannelHome from "./components/youtube/channel/view/ChannelHome";

import CreateChannel from "./components/youtube/channel/create/CreateChannel";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/edms" component={EDMHome} />
            <Route exact path="/edms/create-edm" component={CreateEDM} />

            <Route path="/edms/edit-edm/:edm_id" component={EditEDM} />
            <Route exact path="/gmt/g66" component={ConvertCSV} />
            <Route
              exact
              path="/gmt/h54/complaint"
              component={ComplaintReport}
            />
            <Route
              exact
              path="/youtube/videoranking"
              component={VideoRanking}
            />

            <Route exact path="/youtube/report/monthly" component={Monthly} />
            <Route
              exact
              path="/youtube/report/daily_chart"
              component={DailyChart}
            />
            <Route exact path="/youtube/channel/list" component={ChannelHome} />
            <Route
              exact
              path="/youtube/channel/create-channel"
              component={CreateChannel}
            />

            <Route path="/not-found" component={NotFound} />
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
