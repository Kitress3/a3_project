import React from 'react';
import useWebSocketStore from '../../store/ws';
import useGameStore from '../../store/gameStore';
export class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: "05:00",
      onlineUsersCount: 0,
    };
  }

  componentDidMount() {
    useWebSocketStore.getState().sendMessage(JSON.stringify({ type: "requestOnlineUsers" }))
    console.log("sendmessage")
    this.unsubscribe = useWebSocketStore.subscribe(
      (data) => {
        const messagesList = data.messages
        const wsData = messagesList[messagesList.length - 1]
        switch (wsData.type) {
          case 'timer':
            this.setState({ timeLeft: wsData.value });
            break;
          case 'onlineUsers':
            this.setState({ onlineUsersCount: wsData.value });
            break;
        }
      },
      (state) => state.messages
    );
  }


  // componentWillUnmount() {
  //   this.ws.close();
  // }

  render() {
    return (
      <div className="ui_top" id="ui_stats">
        <center className="stats-size">
          <span className="material-symbols-outlined"> check_circle </span> {useGameStore.getState().successCount}&nbsp;
          <span className="material-symbols-outlined"> help </span> {useGameStore.getState().incompleteCount}&nbsp;
          <span className="material-symbols-outlined"> cancel </span> {useGameStore.getState().failCount}
          <br />
          <hr style={{ width: "20vw" }} />
          <h3>online players count:<span>{this.state.onlineUsersCount}</span></h3>
          <span className="material-symbols-outlined">timer </span>{this.state.timeLeft}
        </center>
      </div>
    );
  }
}
