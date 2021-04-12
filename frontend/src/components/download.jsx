import React, { Component } from 'react';


export default class button extends Component {
    constructor(props) {
        super(props)
        this.state = {

        };
      }

      OnSubmit= async ()=>{
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
      }
    render(){
        if(this.props.etat === "wait"){
            return <p className="wait-telecharge">Wait that the playlist is dowload ... </p>
        } if(this.props.etat === "true"){
            return(
                <button className="wait-telecharge" onClick={this.OnSubmit}>Download</button>
            );
        } else{
            return <p></p>
        }
    }
}