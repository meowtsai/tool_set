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
import NotFound from "./components/layout/NotFound";

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

            <Route path="/not-found" component={NotFound} />
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
