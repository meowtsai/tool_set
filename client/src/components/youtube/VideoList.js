import React, { Component } from "react";
import moment from "moment";
import { CSVLink } from "react-csv";
class VideoList extends Component {
  onCopyClick(chID, chTitle) {
    this.props.copyToInput(chID, chTitle);
  }
  render() {
    const { videos, page, fileName } = this.props;
    console.log(fileName);
    const dataToDisplay = videos
      ? videos.map((video, index) => {
          return {
            rank: index + 1 + 50 * (page - 1),
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            likeCount: video.statistics.likeCount,
            dislikeCount: video.statistics.dislikeCount,
            commentCount: video.statistics.commentCount,
            viewCount: parseInt(video.statistics.viewCount).toLocaleString(),
            duration: moment
              .duration(video.contentDetails.duration)
              .format("d[d] h:mm:ss"),
            channelTitle: video.snippet.channelTitle,

            Youtuber: `https://www.youtube.com/channel/${
              video.snippet.channelId
            }`,
            publishedAt: moment(video.snippet.publishedAt).format(
              "YYYY-MM-DD HH:mm"
            ),
            channelId: video.snippet.channelId,
            id: video.id
          };
        })
      : [];
    const csvHeaders = [
      { label: "#", key: "rank" },
      { label: "影片名稱", key: "title" },

      { label: "長度", key: "duration" },
      { label: "觀看數", key: "viewCount" },
      { label: "喜歡", key: "likeCount" },
      { label: "不喜歡", key: "dislikeCount" },
      { label: "留言", key: "commentCount" },
      { label: "頻道", key: "channelTitle" },
      { label: "發布日期", key: "publishedAt" },
      { label: "影片網址", key: "url" },
      { label: "頻道網址", key: "Youtuber" }
    ];
    return (
      <table className="table table-bordered small">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">影片名稱</th>
            <th scope="col">長度</th>
            <th scope="col">觀看數</th>
            <th scope="col">youtuber</th>
            <th scope="col">發佈於</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay &&
            dataToDisplay.map(item => (
              <tr key={item.id}>
                <th scope="row">{item.rank}</th>
                <td>
                  <a href={item.url} target="_blank">
                    <strong>{item.title}</strong>
                  </a>
                  <br />
                  <div className="font-weight-light mt-2">
                    <small>
                      <i
                        className="far fa-thumbs-up mr-1"
                        style={{ color: "#007bff" }}
                      />
                      {item.likeCount}
                      <i
                        className="far fa-thumbs-down ml-3 mr-1"
                        style={{ color: "#dc3545" }}
                      />
                      {item.dislikeCount}
                      <i
                        className="far fa-comment  ml-3 mr-1"
                        style={{ color: "#6c757d" }}
                      />
                      {item.commentCount}
                    </small>
                  </div>
                </td>
                <td>{item.duration}</td>
                <td>{item.viewCount}</td>
                <td>
                  <a href={item.Youtuber} target="_blank">
                    {item.channelTitle}
                  </a>

                  <button
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={this.onCopyClick.bind(
                      this,
                      item.channelId,
                      item.channelTitle
                    )}
                    title="取得頻道id"
                  >
                    <i className="far fa-copy" />
                  </button>
                </td>
                <td>{item.publishedAt}</td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">
              {dataToDisplay.length > 0 && (
                <CSVLink
                  data={dataToDisplay}
                  headers={csvHeaders}
                  filename={fileName + ".csv"}
                >
                  下載 csv檔案
                </CSVLink>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}
//影片名稱, 長度, viewCount, youtuber
export default VideoList;
