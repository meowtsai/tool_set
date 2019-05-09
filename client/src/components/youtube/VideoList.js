import React, { Component } from "react";
import moment from "moment";

class VideoList extends Component {
  render() {
    const { videos } = this.props;
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
          {videos &&
            videos.map((video, index) => (
              <tr key={video.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                  >
                    <strong>{video.snippet.title}</strong>
                  </a>
                  <br />
                  <div className="font-weight-light mt-2">
                    <small>
                      <i
                        className="far fa-thumbs-up mr-1"
                        style={{ color: "#007bff" }}
                      />
                      {video.statistics.likeCount}
                      <i
                        className="far fa-thumbs-down ml-3 mr-1"
                        style={{ color: "#dc3545" }}
                      />
                      {video.statistics.dislikeCount}
                      <i
                        className="far fa-comment  ml-3 mr-1"
                        style={{ color: "#6c757d" }}
                      />
                      {video.statistics.commentCount}
                    </small>
                  </div>
                </td>
                <td>
                  {moment
                    .duration(video.contentDetails.duration)
                    .format("d[d] h:mm:ss")}
                </td>
                <td>{parseInt(video.statistics.viewCount).toLocaleString()}</td>
                <td>
                  <a
                    href={`https://www.youtube.com/channel/${
                      video.snippet.channelId
                    }`}
                    target="_blank"
                  >
                    {video.snippet.channelTitle}
                  </a>
                </td>
                <td>
                  {moment(video.snippet.publishedAt).format("YYYY-MM-DD HH:mm")}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
}
//影片名稱, 長度, viewCount, youtuber
export default VideoList;
