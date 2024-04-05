import React from 'react';
export class Username extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '', 
      };
    }
    fetchUsername = async () => {
      try {
        const response = await fetch('/api/username/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.setState({ username: data.username });
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };
    componentDidMount() {
      this.fetchUsername();
    }
  
    render() {
      return (
        <div className="ui_top">
			<h2>username: {this.state.username}<span></span></h2>
		</div>
      );
    }
  }