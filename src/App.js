import logo from './logo.svg';
import './App.css';
import TimerDisplay from './Components/Timer';
import Controls from './Components/Controls';
import ModeSelector from './Components/Mode';
import { useState, useEffect } from 'react';

const TIMER_SETTINGS = {
  'work': 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

function App() {
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS['work']);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      //тут надо добавить звук

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
    setTimeLeft(TIMER_SETTINGS[newMode]);
  };

  const handleToggle = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[newMode]);
  };

  return (
    <div className='app-container'>
      <h1>Pomodoro Timer</h1>
      <ModeSelector
        mode={mode}
        onModeChange={handleModeChange}
      />

      <TimerDisplay
        timeLeft={timeLeft}
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
  );
};

export default App;

//ввод времени вручную
//звук по окончании времени
//вид + адаптивка
