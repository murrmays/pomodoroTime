function Controls ({isRunning, onToggle, onReset}) {
    return (
        <div className="controls">
            <button onClick={onToggle} className="start-btn">
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={onReset} className='reset-btn'>Reset</button>
        </div>
    );
};

export default Controls;