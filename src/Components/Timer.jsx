import { useState, useEffect} from "react";
import tomatoImage from '../Assets/tomato.png';

function TimerDisplay({timeLeft, totalTime, isRunning, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState('25');
    const [seconds, setSeconds] = useState('00');

    const radius = 220;
    const stroke = 16;
    const normRadius = radius - stroke * 2;
    const circumference = normRadius * 2 * Math.PI;
    const strokeDashOffset = (timeLeft / totalTime) * circumference;

    useEffect(() => {
        if(!isEditing) {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (Math.ceil(timeLeft) % 60).toString().padStart(2, '0');
            setMinutes(m);
            setSeconds(s);
        }
    }, [timeLeft, isEditing]);

    const handleEdit = () => {
        if (!isRunning) 
            setIsEditing(true);
    };
    const handleSave = () => {
        setIsEditing(false);
        const m = parseInt(minutes) || 0;
        const s = parseInt(seconds) || 0;

        const total = m * 60 + s;
        onUpdate(total);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
      <div className="timer-container">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="timer-svg"
        >
          <circle
            key={timeLeft}
            stroke="white"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            strokeDashoffset={strokeDashOffset}
            strokeLinecap="round"
            fill="transparent"
            r={normRadius}
            cx={radius}
            cy={radius}
            className="progress-ring__circle"
          />
        </svg>

        <div className="timer-image-container">
          <img src={tomatoImage} alt="Tomato" className="timer-image"/>
        </div>

        <div className="timer-text">
          {isEditing ? (
            <div className="timer-display editing">
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="time-input"
              />
              <span className="separator">:</span>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                onKeyDown={handleKeyDown}
                className="time-input"
              />
            </div>
          ) : (
            <div 
              className={`timer-display ${isRunning ? '' : 'editable'}`} 
              onClick={handleEdit}
              title={isRunning ? "Stop timer to edit" : "Press to edit time"}
            >
              {minutes}:{seconds}
            </div>
          )}
        </div>
      </div>
    );
  };

export default TimerDisplay;