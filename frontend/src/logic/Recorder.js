import React, { Component } from 'react'
import "./recorder.css"

const TIME_BEFORE_STOPPING = 2000;
const UPPER_BORDER = 25;
const LOWER_BORDER = 12;

class Recorder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      padding: 0,
      recognizing: false,
      timer: undefined
    }

    this.setText = this.props.setText.bind(this);
    this.audio1 = new Audio("/static/frontend/start_recording.mp3");
    this.audio2 = new Audio("/static/frontend/end_recording.mp3");
  }

  initSpeechRecognition = ( lang ) => {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = lang;

    this.recognition.onerror = function(event) {
      console.error(event);
    };

    this.recognition.onstart = this.recognitionOnStart;
    this.recognition.onend = this.recognitionOnEnd;
    this.recognition.onresult = this.recognitionOnResult;
  }
  
  recognitionOnStart = () => {
    this.setState({recognizing: true});
    console.log('Speech recognition service has started');
  };

  recognitionOnEnd = (e) => {
    this.setState({recognizing: false});
    this.setState({timer: undefined});
    console.log('Speech recognition service disconnected');
  };

  recognitionOnResult = (event) => {
    var interim_transcript = '';
    var final_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript = event.results[i][0].transcript;  
      }
    }
    
    console.log("interim:", interim_transcript);
    let size = interim_transcript.length * 1.5;
    size = this.borderPaddingSize(size);
    if(interim_transcript !== final_transcript)
      this.setState({padding: size });

    let final_text;
    if(this.props.text)
      final_text = this.props.text + " " + final_transcript;
    else 
      final_text = this.props.text + final_transcript;

    this.setText(final_text.replace(/\s+/g, " "));
    if(typeof this.state.timer !== "undefined") {
      clearTimeout(this.state.timer);
    }
    this.setState({timer: setTimeout(() => {this.stopRecording()}, TIME_BEFORE_STOPPING)});
  }
  
  borderPaddingSize = (size) => {
    if(size > UPPER_BORDER)
      return UPPER_BORDER;
    else if(size < LOWER_BORDER)
      return LOWER_BORDER;
    return size;
  }

  componentDidMount() {
    if (window.hasOwnProperty("webkitSpeechRecognition")){
      this.setState({supported: true});
      const waitAnimationTime = 1500;

      setInterval(() => {
        if(this.state.recognizing){
          this.setState({padding: this.borderPaddingSize(this.state.padding + 1)});
          setTimeout(() => {
            if(this.state.recognizing){
              this.setState({padding: this.borderPaddingSize(this.state.padding - 1)});
            }
          }, waitAnimationTime / 2);
        }
      }, waitAnimationTime);
    
    } else { 
      this.setState({supported: false});
    }

    this.audio1.addEventListener('ended', () => this.setState({ audio1: false }));
    this.audio2.addEventListener('ended', () => this.setState({ audio2: false }));
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sourceLang !== this.props.sourceLang) {
      try {
        this.stopRecording();  
      } catch(err){
        console.log(err)
      }
    }
  } 

  componentWillUnmount() {
    this.audio1.removeEventListener('ended', () => this.setState({ audio1: false }));
    this.audio2.removeEventListener('ended', () => this.setState({ audio2: false }));
  }

  togglePlay = (audio, audioName) => {
    this.setState({ audioName: !this.state[audioName] }, () => {
      audio.play ? audio.play() : audio.pause();
    });
  }

  stopRecording = () => {
    this.setState({padding: 0});
    this.recognition.abort();
    this.recognition = undefined;
    
    this.togglePlay(this.audio2, "audio2");
  }

  startRecording = () => {
    this.togglePlay(this.audio1, "audio1");
    this.initSpeechRecognition(this.props.sourceLang);
    this.setState({padding: 15});
    this.recognition.start();
  }

  onChangeRecording = () => {
    if(this.state.recognizing){
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  render() {
    return (
      <div 
        className={[
          "recorder",
          (() => {if(!this.props.sourceLang){ return "recorder__notsupportedlang" } else { return ''}})(),
          (() => {if(!this.state.supported){ return "none" } else { return ''}})()
        ].join(' ')}

        onClick={(() => {if(this.props.sourceLang){return this.onChangeRecording } else { return ()=>{}}})()}
      >  
        <div className="recorder_bg" style={{padding: this.state.padding + "px"}}></div>
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="microphone" className="svg-inline--fa fa-microphone fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"></path></svg>
      </div>
    )
  }
}

export default Recorder
