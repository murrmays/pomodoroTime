import logo from './logo.svg';
import './App.css';
import TimerDisplay from './Components/Timer';
import Controls from './Components/Controls';
import ModeSelector from './Components/Mode';
import { useState, useEffect } from 'react';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleToggle = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(25 * 60);
    } else if (mode === 'short-break') {
      setTimeLeft(5 * 60);
    } else if (mode === 'long-break') {
      setTimeLeft(15 * 60);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setIsRunning(false);
    if (newMode === 'work') {
      setTimeLeft(25 * 60);
    } else if (newMode === 'short-break') {
      setTimeLeft(5 * 60);
    } else if (newMode === 'long-break') {
      setTimeLeft(15 * 60);
    }
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
    </div>
  );
};

export default App;

//ввод времени вручную
//переключение сессий по завершении работы идет перерыв
//  после 4х работ долгий перерыв и тд
//отображать число рабочих сессий
//звук по окончании времени
//вид + адаптивка
