import React, { Component } from 'react';
import { io } from "socket.io-client"; 
import ListeMusique from './components/listMusique'
import DownloadBouton from './components/download'
import photo from './Music-amico-1.png'
import './App.css'
import './responsive.css'
const socket = io('http://localhost:4000');


export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
          url:'',
          message:'',
          listmusique:[{}],
          dlmode:"false",
          telecharger:[]
        };
      }

      handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value
        });
      }
      componentDidMount(){

        socket.on('listmusique', list => {
          console.log(list)
          this.setState({listmusique:list})
          this.setState({dlmode:"wait"})
        })
        socket.on('dl-activate', message =>{
          console.log(message)
          this.setState({dlmode:"true"})
        })
        socket.on('telecharger',message =>{
          //this.state.telecharger.push(message)
          console.log(message)
          this.state.listmusique[message].test = 1
          console.log(this.state.listmusique[message])
        })
      }
      onSubmit = (event) =>{
        event.preventDefault();
        socket.emit('sendmessage', this.state.url)
        
      }
    render(){
        return(
          <div className="Page">
            <div className="nav-barre">
              <p className="title">Smart Download</p>
              <p className="nav">Singel Music</p>
            </div>
          <div className="App">
            <div className="part1">
              <div className="downloaderPlace">
              <form className="form" onSubmit={this.onSubmit}>
                <input className="url-log"
                  type="url"
                  name="url"
                  placeholder="playlist url ..."
                  value={this.state.url}
                  onChange={this.handleInputChange}
                  required
                />
                <input className="send" type="submit" value="Search"/>
              </form>
              <ListeMusique list={this.state.listmusique} telecharger={this.state.telecharger}/>
              <DownloadBouton etat={this.state.dlmode}/>
              </div>
            </div>
            <div className="part2">
              <div className="photo-box">
                <img className="photo" src={photo}/>
              </div>
            </div>
          </div>
          </div>
        );
    }
}