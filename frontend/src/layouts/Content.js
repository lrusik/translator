import React, { Component } from 'react'
import "./content.css";
import TextareaAutosize from 'react-textarea-autosize';
import Select from 'react-select'
import Loading from './Loading'
import Recorder from "../logic/Recorder";

export class Content extends Component {
    constructor(props) {
        super(props);
        this.setText = this.props.setText.bind(this);
        this.state = {
            sourceLang: ""
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.sourceLang !== this.props.sourceLang) {
            const sourceLang = this.props.languages.filter( option => option.value === this.props.sourceLang )[0]
            if(sourceLang)
                this.setState({ sourceLang: sourceLang });
            else 
                this.setState({ sourceLang: "" });
        }
    }

    showResult = () => {
        if(this.props.errorMessage)
            return (<p>{this.props.errorMessage}</p>)
        if(this.props.resultAnimation)
            return <Loading />;

        if(!this.props.translation.length)
            return (<p style={{ direction: "rtl" }}>תרגום</p>);   
        return (<p style={{ direction: "rtl" }}> { this.props.translation } </p>);    
    }

    getSourceLang = () => {
        if(this.state.sourceLang) 
            return this.state.sourceLang
        
        if(this.props.detected) 
            try {
                let sourceLang = this.props.languages.filter( option => option.value === this.props.detected )[0]
                if(!sourceLang["label"].includes('Detected')){
                    sourceLang["label"] = "Detected (" + sourceLang["label"] + ")";   
                }
                return sourceLang
            } catch(err){}
        return "";    
    } 

    render() {
        return (
            <div key={this.props.translation} className="content">
                <div className="content__inner">
                    <div className="content__column">
                        <div className="content__title">
                            <Select 
                                className="content__title_inner"
                                options={this.props.languages}
                                onChange={ (e) => this.props.setSourceLang(e.value)}
                                placeholder="Language..."
                                value={this.getSourceLang()}
                            />
                        </div>
                        <div className="content__textarearealative"> 
                            <TextareaAutosize 
                                className="content__text" 
                                placeholder="..."
                                autoFocus
                                value={this.props.text}
                                onChange={ (event) => {this.setText(event.target.value)}}
                            /> 
                            <div className="app-speech-recorder">
                                <Recorder 
                                    sourceLang={this.props.sourceLang}
                                    setText={this.props.setText}
                                    text={this.props.text}    
                                />
                            </div>    
                        </div>
                    </div>
                    <div className="content__column">
                        <div className="content__title">
                            <div className="content__regtitle" style={{ direction: "rtl" }}>עברית</div>
                        </div>
                        <div className="content__text"> { this.showResult() } </div>
                    </div>    
                </div>
                
            </div>
        )
    }
}

export default Content