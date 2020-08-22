import React, { Component } from 'react'
import Submit from "../logic/Submit";
import "./header.css";

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="header__inner">
                    <Submit 
                        sourceLang={this.props.sourceLang} 
                        text={this.props.text} 
                        setTranslation={this.props.setTranslation}
                        setDetected={this.props.setDetected}
                        setResultAnimation={this.props.setResultAnimation}
                        setError={this.props.setError}
                        inner="Translate" 
                    />
                </div>
            </header>
        )
    }
}

export default Header
