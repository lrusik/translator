import React, { Component } from 'react';
import './app.css';
import Header from "./layouts/Header";
import Content from "./layouts/Content";
import axios from 'axios';

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      text: "",
      translation: "",
      sourceLang: "",
      detected: "",
      resultAnimation: false, //false
      languages: [],
      errorMessage: ""
    }
    this.getLanguagesList();
  }
  
  componentDidMount() {
    const lang = this.getSourceLangFromStorage();
    this.setState( {sourceLang: lang});
  }
  
  getSourceLangFromStorage = () => {
    try {
      const langValue = localStorage.getItem('sourceLang');
      const ret = this.state.languages.filter( option => option.value === langValue );
      if(ret)
        return ret[0].value;
    } catch(err) {
      console.log("SOURCELANG:", err);
    }
    return '';  
  } 

  setLanguagesList = (lang_list) => {
    this.setState({ languages: lang_list });
    this.setState({ sourceLang: this.getSourceLangFromStorage() });
  }

  getLanguagesList = () => {
    axios
    .get("/api/lang_list")
    .then((response) => {
        const ret = [{value: '', label: 'Language...'}];
        for (const [key, value] of Object.entries(response.data)) {
          ret.push({value: key, label: capitalize(value)});
        }
        this.setLanguagesList(ret);
      }, (error) => {
          console.Error("Couldn't get the languages list", error);
          this.setError(1);
      }
    )
  }
  
  getAndSaveSourceLang = () => {
    this.forceUpdate()
    const sourceLang = this.getSourceLangFromStorage();
    this.setState({ sourceLang: sourceLang[0].value});
  }

  getSourceLang = () => {
    try {
      return this.getSourceLangFromStorage();
    } catch(err) {
      console.log(err);
    }

    console.log("Setting default language (en)");
    return "en";
  }

  setSourceLang = (newLang) => {
    localStorage.setItem('sourceLang', newLang);
    this.setState( {sourceLang: newLang} );
  }

  setTranslation = (translation) => {
    this.setState( {translation: translation} );
    this.setResultAnimation(false);
  }

  setText = (text) => {
    this.setState( {text: text} );
  }
  
  setDetected = (lang) => {
    if(lang)
      this.setState({detected: lang})
  }

  setResultAnimation = (anState) => {
    this.setState({ resultAnimation: anState});
  }

  setError = (errorCode) => {
    let errorMessage;
    switch(errorCode){
      case 0:
        errorMessage = "";
        break;
      case 3:
        errorMessage = "Couldn't translate";
        break;
      case 4:
        errorMessage = "Couldn't add nekudot";
        break;
      case 5:
        errorMessage = "The text is to big";
        break;
      case 6:
        errorMessage = "Nothing to translate...";
        break;
      default: 
        errorMessage = "Ooops, something went wrong...";
    }

    this.setState({ errorMessage: errorMessage })
  }

  render() {
    return (
      <div className="App">
        <Header 
          sourceLang={this.state.sourceLang}
          setTranslation={this.setTranslation}
          setDetected={this.setDetected}
          setResultAnimation={this.setResultAnimation}
          text={this.state.text}
          setError={this.setError} 
        />

        <Content
          resultAnimation={this.state.resultAnimation}
          detected={this.state.detected}
          setText={this.setText}
          text={this.state.text} 
          translation={this.state.translation}
          setSourceLang={this.setSourceLang}
          sourceLang={this.state.sourceLang} 
          languages={this.state.languages}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  }
  
}

export default App;