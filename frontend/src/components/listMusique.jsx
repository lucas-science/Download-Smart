import React, { Component } from 'react';


export default class button extends Component {
    constructor(props) {
        super(props)
        this.state = {
          listmusique:[{}],
          etat:false
        };
      }

    render(){
        if(this.props.list.length === 1){
            return <p></p>
        } else {
            return(
                <div className="list-musique">
                  {this.props.list.map((item,key)=>(
                    <div className="musique">
                      <img  className="img-musique" src={item.bestThumbnail.url}/>
                      <p className="text-musique">{item.title}</p>
                    </div>
                  ))}
                </div>
            );
        }
    }
}