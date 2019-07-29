import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
class Navbar extends Component {
  render() {
    //console.log("Navbar", this.props);
    const { location } = this.props;
    let navbar_data = { icon: "", title: "", menu: [] };
    if (location.pathname.split("/")[1] === "gmt") {
      navbar_data = {
        icon: "fas fa-clipboard-list text-dark",
        title: "GMT 工具",
        menu: [{ label: "😖 海島檢舉分析報表", link: "/gmt/h54/complaint" }]
      };
    } else if (location.pathname.split("/")[1] === "service_rpt") {
      navbar_data = {
        icon: "fas fa-concierge-bell text-success",
        title: "後送統計報表",
        menu: [{ label: "★ 總覽", link: "/service_rpt/home" }]
      };
    } else {
      navbar_data = {
        icon: "fab fa-youtube text-danger",
        title: "Youtube Data",
        menu: [
          { label: "★ 影片搜尋", link: "/youtube/videoranking" },
          { label: "📅 Youtuber 月報表", link: "/youtube/report/monthly" },
          { label: "🔥 遊戲類發燒日報表", link: "/youtube/report/daily_chart" },
          { label: "😎 關注頻道主列表", link: "/youtube/channel/list" }
        ]
      };
    }

    return (
      <nav className="navbar navbar-expand-md navbar-dark  fixed-top bd-navbar">
        <div className="container">
          <div className="dropdown">
            <span
              className="btn btn-info dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className={navbar_data.icon} /> {navbar_data.title}
            </span>

            <div className="dropdown-menu">
              {navbar_data.menu &&
                navbar_data.menu.map(menu => (
                  <Link
                    to={menu.link}
                    className="dropdown-item"
                    key={menu.link}
                  >
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
export default withRouter(Navbar);
