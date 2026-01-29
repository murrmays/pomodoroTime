function Controls ({isRunning, onToggle, onReset}) {
    return (
        <div className="controls">
            <button onClick={onToggle}>
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
};

export default Controls;