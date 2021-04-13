import React, { Component } from 'react';
import '../App.css'

export default class button extends Component {
    constructor(props) {
        super(props)
        this.state = {
          cursor:'pointer',
          click:0,
          message:''
        };
      }
      sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
      OnSubmit= async ()=>{
        if(this.state.click === 0){
          this.setState({cursor:'not-allowed'})
          this.setState({click:1})
          const getData = await fetch('http://localhost:4000/test', {
              method: 'GET',
              // credentials : include permet d'intégrer les cookie avec la requête
              credentials: 'include', 
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(response => response.blob())
            .then(blob => {
              let file = window.URL.createObjectURL(blob);
              console.log(blob)
              window.location.assign(file);
            })
        } else{
          this.setState({message:"You have already downloaded."})
          await this.sleep(3000)
          this.setState({message:""});
        }
      }
    render(){
        if(this.props.etat === "wait"){
            return <p className="wait-telecharge">Wait that the playlist is dowload ... </p>
        } if(this.props.etat === "true"){
              
          return(
            <>
                <button className="wait-telecharge" style={this.state.cursor === 'not-allowed' ? {"cursor":'not-allowed'} : {"cursor":"pointer"} } onClick={this.OnSubmit}>Download</button>
                <p className="mess-erreur">{this.state.message}</p>
            </>
          );
            
        } else{
            return <p></p>
        }
    }
}