import React, { Component } from "react";
import { Link } from "react-router-dom";
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark  fixed-top bd-navbar">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              {/* <li className="nav-item active">
                <Link to="/edms" className="nav-link">
                  發送EDM
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/gmt/g66" className="nav-link">
                  GMT 分析
                </Link>
              </li> */}
              <li className="nav-item active">
                <Link to="/youtube/videoranking" className="nav-link">
                  Youtube 分析
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
export default Navbar;
