import './App.css';
import { useState, useEffect, useCallback, useRef } from 'react';

import TimerDisplay from './Components/Timer';
import Controls from './Components/Controls';
import ModeSelector from './Components/Mode';
import SettingsModal from './Components/Settings';

import dingSound from './Assets/ding.mp3';
import microwaveSound from './Assets/microwave-ding.mp3';
import digitalSound from './Assets/notification.mp3';
import tickSound from './Assets/tick.mp3';
import lofiSound from './Assets/lofi.mp3';
import tomatoIcon from './Assets/ic_tomato.png';

const SOUNDS = {
  'ding': dingSound,
  'microwave': microwaveSound,
  'digital': digitalSound
};

const tickAudio = new Audio(tickSound);
const lofiAudio = new Audio(lofiSound);
lofiAudio.loop = true;

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
  const lastSecondRef = useRef(null);
  const stateRef = useRef({ mode, settings, soundType, volume, bgType, longBreakInterval, cycles });

  useEffect(() => {
    stateRef.current = { mode, settings, soundType, volume, bgType, longBreakInterval, cycles };
  }, [mode, settings, soundType, volume, bgType, longBreakInterval, cycles]);

  useEffect(() => {
    tickAudio.volume = volume;
    lofiAudio.volume = volume;

    if (isRunning && bgType === 'lofi') {
      lofiAudio.play().catch(() => {});
    } else {
      lofiAudio.pause();
    }
  }, [isRunning, bgType, volume]);

  const playSound = useCallback(() => {
    const { soundType, volume } = stateRef.current;
    const audio = new Audio(SOUNDS[soundType]);
    audio.volume = volume;
    audio.play().catch(() => {});
  }, []);

  const switchMode = useCallback((newMode) => {
    const nextTime = stateRef.current.settings[newMode];
    setMode(newMode);
    setTimeLeft(nextTime);
    targetTimeRef.current = null;
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      targetTimeRef.current = null;
      lastSecondRef.current = null;
      return;
    }

    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + timeLeft * 1000;
    }

    const interval = setInterval(() => {
      const remaining = (targetTimeRef.current - Date.now()) / 1000;

      if (remaining > 0) {
        setTimeLeft(remaining);

        if (stateRef.current.bgType === 'tick') {
          const currentSecond = Math.ceil(remaining);
          if (currentSecond !== lastSecondRef.current) {
            const node = tickAudio.cloneNode();
            node.volume = volume;
            node.play().catch(() => {});
            lastSecondRef.current = currentSecond;
          }
        }
      } else {
        clearInterval(interval);
        setTimeLeft(0);
        playSound();

        const { mode, cycles, longBreakInterval } = stateRef.current;
        if (mode === 'work') {
          const newCycles = cycles + 1;
          setCycles(newCycles);
          switchMode(newCycles % longBreakInterval === 0 ? 'long-break' : 'short-break');
        } else {
          switchMode('work');
        }
      }
    }, 25);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode, playSound, switchMode]);

  const handleToggle = () => setIsRunning(!isRunning);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(settings[mode]);
  }, [settings, mode]);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(settings[newMode]);
  }, [settings]);

  const handleTimeUpdate = (newTime) => {
    const newSettings = { ...settings, [mode]: newTime };
    setSettings(newSettings);
    setTimeLeft(newTime);
  };

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
          settings={settings}
          updateSettings={(name, val) => {
            const newSettings = { ...settings, [name]: val };
            setSettings(newSettings);
            if (mode === name && !isRunning) setTimeLeft(val);
          }}
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
}

export default App;