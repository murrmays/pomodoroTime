import { useState, useEffect} from "react";

function TimerDisplay({timeLeft, isRunning, onUpdate}) {
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState('25');
    const [seconds, setSeconds] = useState('00');

    useEffect(() => {
        if(!isEditing) {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
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

    if (isEditing) {
    return (
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
        <button onClick={handleSave} className="save-btn">Ok</button>
      </div>
    );
  }

  return (
    <div 
      className={`timer-display ${isRunning ? '' : 'editable'}`} 
      onClick={handleEdit}
      title={isRunning ? "Stop timer to edit" : "Press to edit time"}
    >
      {minutes}:{seconds}
    </div>
  );
};
export default TimerDisplay;