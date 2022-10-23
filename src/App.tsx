import React, {useRef, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import vid1 from './videos/vid1.mp4';
import vid2 from './videos/vid2.mp4';
import vid3 from './videos/vid3.mp4';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import { AiFillCaretUp, AiFillCaretDown, AiOutlineMinus, AiOutlinePlus, AiOutlinePause, AiOutlinePoweroff } from 'react-icons/ai'
import { FaPlay } from 'react-icons/fa';

function App() {

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const videos = [vid1, vid2, vid3]
  const vidRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideo] = useState(0)
  const [powerState, setPower] = useState(false)
  const [volume, setVolume] = useState(1);
  const [paused, setPlayback] = useState(true)

  const changeChannel = (isUp: boolean) => {
    if (isUp) {
      if (videoIndex + 1 == videos.length) {
        setVideo(0)
      } else {
        setVideo(videoIndex+1)
      }
    } else {
      if (videoIndex - 1 < 0) {
        setVideo(videos.length-1)
      } else {
        setVideo(videoIndex-1)
      }
    }
  }

  const handleActions = (action:string) => {
    action = action.split('/')[0];
    switch (action) {
      case 'power': 
        setPower(false);
        break;
      case 'up_channel':
        changeChannel(true);
        break;
      case 'down_channel':
        changeChannel(false);
        break;
      case 'up_volume':
        adjustVolume(true);
        break;
      case 'down_volume':
        adjustVolume(false);
        break;
      case 'pause':
        handlePlayback(false);
        break;
      case 'resume':
        handlePlayback(true);
        break;
      default:
        break;
    }
  }

  const adjustVolume = (higher:boolean) => {
    console.log('volume is ', volume)
    if (higher) {
      vidRef.current!.volume = (volume+.1);
      setVolume((volume+.1))
    } else {
      vidRef.current!.volume = (volume-.1);
      setVolume((volume-.1))
    }
  }

  const handlePlayback = (paused:boolean) => {
    if (paused) {
      setPlayback(false)
      vidRef.current!.play()
    } else {
      setPlayback(true)
      vidRef.current!.pause()
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", "djuwon"), (doc) => {
        let data = doc.data();
        handleActions(data?.action);
    });
    return () => {
      unsub();
    }
  }, [])

  return (
    <div className="App">
      <div className='container'>
        <div className='inner_container'>
          <div className='top_color_row'></div>
          <div className='bottom_color_row'></div>
          <div className='tv_container'>
            <div className='tv_frame'>
              <div className='tv_content'>
                {!powerState && <img className='off_view' src={require("./assets/offstate.png")} />}
                {(powerState) && videos.map((v,i) => {
                  if (i == videoIndex) {
                    return (
                      <video ref={vidRef} autoPlay style={{width: '100%', height: '100%'}}>
                        <source src={v} type="video/mp4"/>
                      </video>
                    )
                  }
                })}
              </div>
            </div>
          </div>
          <div className='tv_remote_container'>
            <div className='buttons'>
              <div className='button_container'>
                <div className='button_frame blank' onClick={() => handlePlayback(false)}>
                  <AiOutlinePause size={40}/>
                </div>
              </div>
              <div className='button_container'>
                <div className='button_frame power' onClick={() => {
                  setPower(!powerState);
                  vidRef.current?.play();
                }}>
                  <AiOutlinePoweroff size={40}/>
                </div>
              </div>
            </div>
            <div className='dial_container'>
              <div className='dial_frame'>
                <div className='dial_button_container'>
                  <div className='lower_volume' onClick={() => adjustVolume(false)}>
                    <div className='button_container'>
                      <AiOutlineMinus size={60}/>
                    </div>
                  </div>
                  <div className='volume_container'>
                    <div className='up_channel' onClick={() => changeChannel(true)}>
                      <div className='button_container'>
                        <AiFillCaretUp size={60}/>
                      </div>
                    </div>
                    <div className='down_channel' onClick={() => handlePlayback(true)}>
                      <div className='button_container' style={{alignItems: 'center', justifyContent: 'center'}}>
                        <FaPlay size={40}/>
                      </div>
                    </div>
                    <div className='down_channel' onClick={() => changeChannel(false)}>
                      <div className='button_container'>
                        <AiFillCaretDown size={60}/>
                      </div>
                    </div>
                  </div>
                  <div className='up_volume' onClick={() => adjustVolume(true)}>
                    <div className='button_container'>
                      <AiOutlinePlus size={60}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
