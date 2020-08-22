import React, { Component } from 'react'
import "./loading.css"

export class Loading extends Component {
    render() {
        return (
            <div className="lsd-ellipsis_root">  
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
}

export default Loading
