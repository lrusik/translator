import React, { Component } from 'react'
import "./submit.css";
import axios from "axios";

// errors
class Submit extends Component {
    constructor(props){ 
        super(props);
        this.setTranslation = this.props.setTranslation.bind(this);
        this.setDetected = this.props.setDetected.bind(this);
        this.setResultAnimation = this.props.setResultAnimation.bind(this);
        this.setError = this.props.setError.bind(this);
    }

    send = () => {
        if(!this.props.text){
            this.setError(6);
            return;
        }

        this.setResultAnimation(true);
        axios.post('/api/translate', {
            text: this.props.text,
            sourceLang: this.props.sourceLang
        })
        .then(
            (response) => {
                this.setError(0);
                this.setTranslation(response.data.translated);
                this.setDetected(response.data.sourceLang);
            }, (error) => {
                this.setError(error.response.data.error);
            }
        )
    }
    render() {
        return (
            <div className="submit" onClick={this.send}>
                <div className="submit__button">{ this.props.inner }</div>
                <div className="submit__border_h"></div>
                <div className="submit__border_w"></div>  
            </div>
        )
    }
}

export default Submit
