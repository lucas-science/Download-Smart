import React, { Component } from 'react';
import { io } from "socket.io-client"; 
const socket = io('http://localhost:4000');


export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
          url:'',
          message:''
        };
      }

      handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value
        });
      }
    
      onSubmit = (event) =>{
        event.preventDefault();
        socket.emit('sendmessage', this.state.url)
      }
    render(){
        return(
          <div className="App">
            <p>App</p>
            <form onSubmit={this.onSubmit}>
              <input className="email-login"
                type="url"
                name="url"
                placeholder="playlist url ..."
                value={this.state.url}
                onChange={this.handleInputChange}
                required
              />
              <input className="send" type="submit" value="download"/>
            </form>
          </div>
        );
    }
}