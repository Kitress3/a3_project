import React from 'react';
import useUIVisible from '../../store';
export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: '',
          };
    }
    handleClick = (menuName, toggleFunction) => {
        this.setState({ activeMenu: menuName });
        toggleFunction(); 
      }
    render() {
        const rightMenus=[{key:'ui_username',value:'perseon',method:useUIVisible.getState().toggleUiUsername},
        {key:'ui_play',value:'play_circle',method:useUIVisible.getState().toggleUiPlay},
        {key:'ui_stats',value:'leaderboard',method:useUIVisible.getState().toggleUiStats},
        {key:'ui_instructions',value:'help',method:useUIVisible.getState().toggleUiInstructions}]

        return (
            <header>
                <nav>
                    <span className="alignleft"></span>
                    <span className="aligncenter">
                        <a  className={`title ${this.state.activeMenu === 'ui_home' ? 'items-active' : ''}`} onClick={() => this.handleClick('ui_home', useUIVisible.getState().toggleUiHome)}>309DLE</a>
                    </span>
                    <span className="alignright">
                        {rightMenus.map((menu)=>{
                           
                                  <a name={menu.key} onClick={() => this.handleClick(menu.key, menu.method)}><span className={`material-symbols-outlined ${this.state.activeMenu === menu.key ? 'items-active' : ''}`}  > {menu.value} </span></a>
                        
                        })}
                    </span>
                </nav>
            </header>
        );
    }
}