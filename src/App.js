import './App.css';
import { useState, useEffect, useCallback, useRef } from 'react';

import TimerDisplay from './Components/Timer';
import Controls from './Components/Controls';
import ModeSelector from './Components/Mode';
import SettingsModal from './Components/Settings';

import dingSound from './Assets/ding.mp3';
import microwaveSound from './Assets/microwave-ding.mp3'
import digitalSound from './Assets/notification.mp3'
import tickSound from './Assets/tick.mp3'
import lofiSound from './Assets/lofi.mp3'
import tomatoIcon from './Assets/ic_tomato.png';

const SOUNDS = {
  'ding': dingSound,
  'microwave': microwaveSound,
  'digital': digitalSound
};

function App() {
  const [settings, setSettings] = useState({
    'work': 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
  });

  const [timeLeft, setTimeLeft] = useState(settings['work']);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [cycles, setCycles] = useState(0);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundType, setSoundType] = useState('ding');
  const [volume, setVolume] = useState(0.5);
  const [bgType, setBgType] = useState('none');

  const targetTimeRef = useRef(null);
  const tickAudioRef = useRef(new Audio(tickSound));
  const lofiAudioRef = useRef(new Audio(lofiSound));
  const lastSecondRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    tickAudioRef.current.preload = 'auto';
    lofiAudioRef.current.preload = 'auto';
    lofiAudioRef.current.loop = true;
  }, []);

  const playSound = () => {
    const file = SOUNDS[soundType];
    const audio = new Audio(file);
    audio.volume = volume;
    audio.play();
  };

  useEffect(() => {
    lofiAudioRef.current.loop = true;
  }, []);

  useEffect(() => {
    tickAudioRef.current.volume = volume;
    lofiAudioRef.current.volume = volume;

    if (bgType !== 'lofi' || !isRunning) {
      lofiAudioRef.current.pause();
    }
    if (bgType === 'lofi' && isRunning) {
      lofiAudioRef.current.play();
    }
  }, [volume, bgType, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      targetTimeRef.current = null;
      return;
    }
    
    let interval = null;
    
    if (targetTimeRef.current === null){
        targetTimeRef.current = Date.now() + timeLeft * 1000;
    }
    
    interval = setInterval(() => {
        const remainingTime = (targetTimeRef.current - Date.now()) / 1000;
        if (remainingTime > 0) {
          setTimeLeft(remainingTime);

          if (bgType === 'tick') {
            const currentSecond = Math.ceil(remainingTime);
            if (currentSecond !== lastSecondRef.current) {
              const sound = tickAudioRef.current;
              
              if (!sound.paused) {
                sound.pause();
                sound.currentTime = 0;
              } else {
                sound.currentTime = 0;
              }
              
              sound.play().catch(() => {});
              lastSecondRef.current = currentSecond;
            }
          }

        } else {
          setTimeLeft(0);
          setIsRunning(false);

          targetTimeRef.current = null;
          lofiAudioRef.current.pause();
          lofiAudioRef.current.currentTime = 0;
          
          playSound();

          if(mode === 'work') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles % longBreakInterval === 0)
              switchMode('long-break');
            else
              switchMode('short-break');
          } else {
            switchMode('work');
          }
        }
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning, mode, cycles, settings, soundType, volume, bgType, longBreakInterval]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode]);
    setIsRunning(true);
  };

  const handleToggle = useCallback(() => setIsRunning(!isRunning), [isRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  }, [settings, mode]);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    setIsRunning(false);
    setTimeLeft(settings[newMode]);
  }, [settings]);

  const handleTimeUpdate = useCallback((newTime) => {
    const newSettings = {...settings, [mode]: newTime};
    setSettings(newSettings);
    setTimeLeft(newTime);
  }, [settings, mode]);

  return (
    <div className={`app-wrapper ${mode}`}>
      <header className='app-header'>
          <h1 className='app-title'>Pomodoro Timer</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className='settings-button'
          >
            Settings
          </button>
      </header>

      <div className='app-container'>
        <h1 className='app-title'>Let's focus!</h1>
        <ModeSelector
          mode={mode}
          onModeChange={handleModeChange}
        />

        <TimerDisplay
          key={mode}
          timeLeft={timeLeft}
          totalTime={settings[mode]}
          isRunning={isRunning}
          onUpdate={handleTimeUpdate}
        />

        <Controls
          isRunning={isRunning}
          onToggle={handleToggle}
          onReset={handleReset}
        />

        <div className='cycles-display'>
          Completed sessions: {cycles}
        </div>

        <div className='sessions-grid'>
          {Array(cycles).fill(null).map((_, index) => (
            <img
              key={index}
              src={tomatoIcon}
              alt='session-icon'
              className='session-icon'
            />
          ))}
        </div>
      </div>
      {isSettingsOpen && (
        <SettingsModal
          soundType={soundType}
          setSoundType={setSoundType}
          volume={volume}
          setVolume={setVolume}
          bgType={bgType}
          setBgType={setBgType}
          longBreakInterval={longBreakInterval}
          setLongBreakInterval={setLongBreakInterval}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;