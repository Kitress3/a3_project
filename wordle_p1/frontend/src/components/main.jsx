import React from 'react';
import { api_getUsername, api_guess, api_newgame } from './api';
import { Header } from './Header';
import {Home} from './Home'
import {Instructions} from './Instructions'
import {Play} from './Play'
import {Stats} from './Stats'
import {Username} from './Username'
import "../index.css"
import useUIVisible from '../store';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ui_home: useUIVisible.getState().ui_home,
      ui_username: useUIVisible.getState().ui_username,
      ui_play: useUIVisible.getState().ui_play,
      ui_stats: useUIVisible.getState().ui_stats,
      ui_instructions: useUIVisible.getState().ui_instructions,
    };
  }

  componentDidMount() {
    this.unsubscribe = useUIVisible.subscribe((state) => {
      this.setState({
        ui_home: state.ui_home,
        ui_username: state.ui_username,
        ui_play: state.ui_play,
        ui_stats: state.ui_stats,
        ui_instructions: state.ui_instructions,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { ui_home, ui_username, ui_play, ui_stats, ui_instructions } = this.state;
    return (
      <div>
        <Header />
        {ui_home ? <Home /> : ''}
        {ui_username ? <Username /> : ''}
        {ui_play ? <Play /> : ''}
        {ui_stats ? <Stats /> : ''}
        {ui_instructions ? <Instructions /> : ''}
      </div>
    );
  }
}
export { Main };
