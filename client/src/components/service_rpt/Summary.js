import React from "react";
import PropTypes from "prop-types";
import Progressbar from "./Progressbar";
const Summary = ({ summary }) => {
  //console.log("Summary ", summary);
  let sum, sum_process, sum_done, sum_robot;
  let games;
  if (summary) {
    sum = summary.reduce((acc, curr) => acc + curr.cnt, 0);
    sum_process = summary.reduce(
      (acc, curr) => acc + parseInt(curr.status_process - curr.status_robot),
      0
    );
    sum_done = summary.reduce(
      (acc, curr) => acc + parseInt(curr.status_done),
      0
    );
    sum_robot = summary.reduce(
      (acc, curr) => acc + parseInt(curr.status_robot),
      0
    );
    games = summary.map(game => ({
      ...game,
      percetage: parseFloat((game.cnt / sum) * 100).toFixed(2),
      done_perc: parseFloat((game.status_done / sum) * 100).toFixed(2),
      process_perc: parseFloat(
        ((game.status_process - game.status_robot) / sum) * 100
      ).toFixed(2),
      robot_perc: parseFloat((game.status_robot / sum) * 100).toFixed(2)
    }));
  } else {
    return <div />;
  }

  //console.log("games", games)

  return (
    <div className="result_area">
      <div className="row mb-3">
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-3">
              <div className="callout callout-info">
                <small className="text-mute">總數 </small> <br />
                <strong>{sum} 件 </strong>
                <div className="chart-wrapper" />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="callout callout-danger">
                <small className="text-mute">未處理</small> <br />
                <strong>{sum_robot} 件 </strong>
                <small className="text-mute">
                  ( {parseFloat((sum_robot / sum) * 100).toFixed(2)} %)
                </small>{" "}
                <br />
                <div className="chart-wrapper" />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="callout callout-warning">
                <small className="text-mute">處理中 </small> <br />
                <strong>{sum_process} 件 </strong>
                <small className="text-mute">
                  ( {parseFloat((sum_process / sum) * 100).toFixed(2)} %)
                </small>{" "}
                <br />
                <div className="chart-wrapper" />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="callout callout-success">
                <small className="text-mute">處理完畢</small> <br />
                <strong>{sum_done} 件 </strong>
                <small className="text-mute">
                  ( {parseFloat((sum_done / sum) * 100).toFixed(2)} %)
                </small>{" "}
                <br />
                <div className="chart-wrapper" />
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          {games &&
            games.map(game => (
              <div key={game.game_id} className="progress-group">
                <div className="progress-group-header">
                  <i className="progress-group-icon" />
                  <small className="text-primary">{game.game_name}</small>
                  <div className="ml-auto font-weight-bold">
                    {game.percetage}%
                  </div>
                  <small className="text-mute">({game.cnt})</small>
                </div>
                <div className="progress-group-bars">
                  <div className="progress progress-xs">
                    <Progressbar
                      type="danger"
                      percentage={Number.parseFloat(game.robot_perc)}
                      capation={game.status_robot.toString()}
                    />
                    <Progressbar
                      type="warning"
                      percentage={Number.parseFloat(game.process_perc)}
                      capation={(
                        game.status_process - game.status_robot
                      ).toString()}
                    />
                    <Progressbar
                      type="success"
                      percentage={Number.parseFloat(game.done_perc)}
                      capation={game.status_done.toString()}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Summary.propTypes = {};

export default Summary;
