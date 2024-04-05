import React from 'react';
import useUIVisible from '../../store';
export class Header extends React.Component {
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
    handleClick = (toggleFunction) => {
        toggleFunction();
    }
    render() {
        const rightMenus = [
            { key: 'ui_username', value: 'person', method: useUIVisible.getState().toggleUiUsername },
            { key: 'ui_play', value: 'play_circle', method: useUIVisible.getState().toggleUiPlay },
            { key: 'ui_stats', value: 'leaderboard', method: useUIVisible.getState().toggleUiStats },
            { key: 'ui_instructions', value: 'help', method: useUIVisible.getState().toggleUiInstructions }]

        return (
            <header>
                <nav>
                    <span className="alignleft"></span>
                    <span className="aligncenter">
                        <a className={`title ${this.state.ui_home === true ? 'items-active' : ''}`} onClick={() => this.handleClick(useUIVisible.getState().toggleUiHome)}>309DLE</a>
                    </span>
                    <span className="alignright">
                        {rightMenus.map((menu) => {
                            return (
                                <a onClick={() => this.handleClick(menu.method)}>
                                    <span className={`material-symbols-outlined ${this.state[menu.key] === true ? 'items-active' : ''}`} > {menu.value} </span>
                                </a>
                            )

                        })}
                    </span>
                </nav>
            </header>
        );
    }
}