import React, { Component } from "react";
import { Link } from "react-router-dom";
class Navbar extends Component {
  render() {
    const yt_menu = [
      { label: "★ 影片搜尋", link: "/youtube/videoranking" },
      { label: "📅 Youtuber 月報表", link: "/youtube/report/monthly" },
      { label: "🔥 遊戲類發燒日報表", link: "/youtube/report/daily_chart" },
      { label: "😎 關注頻道主列表", link: "/youtube/channel/list" }
    ];

    return (
      <nav className="navbar navbar-expand-md navbar-dark  fixed-top bd-navbar">
        <div className="container">
          <div className="dropdown">
            <a
              className="btn btn-info dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fab fa-youtube text-danger" /> Youtube Data
            </a>

            <div className="dropdown-menu">
              {yt_menu &&
                yt_menu.map(menu => (
                  <Link to={menu.link} className="dropdown-item">
                    {menu.label}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
export default Navbar;
