import './App.css';
import TimerDisplay from './Components/Timer';
import Controls from './Components/Controls';
import ModeSelector from './Components/Mode';
import { useState, useEffect, useCallback } from 'react';
import alarmSound from './Assets/alarm.mp3';

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
  const playSound = () => {
    const audio = new Audio(alarmSound);
    audio.play();
  };
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      playSound();

      if(mode === 'work') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % 4 === 0)
          switchMode('long-break');
        else
          switchMode('short-break');
      } else 
        switchMode('work');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, cycles]);

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
      <div className='app-container'>
        <h1 className='app-title'>Pomodoro Timer</h1>
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
      </div>
    </div>
  );
};

export default App;