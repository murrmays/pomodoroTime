function TimerDisplay({timeLeft}) {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-display">
            {formatTime(timeLeft)}
        </div>
    );
};
export default TimerDisplay;