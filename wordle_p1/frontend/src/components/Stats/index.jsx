import React from 'react';
export class Stats extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="ui_top" id="ui_stats">
        <center className="stats-size">
            <span className="material-symbols-outlined"> check_circle </span> 8 &nbsp;
            <span className="material-symbols-outlined"> help </span> 1 &nbsp;
            <span className="material-symbols-outlined"> cancel </span> 2
        </center>
    </div>
      );
    }
  }