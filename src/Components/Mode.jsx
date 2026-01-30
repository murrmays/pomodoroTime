function ModeSelector ({mode, onModeChange}) {
    return (
        <div className="mode-buttons">
            <button
                onClick={() => onModeChange('work')}
                className={mode === 'work' ? 'active' : ''}
            >
                Work
            </button>
            <button
                onClick={() => onModeChange('short-break')}
                className={mode === 'short-break' ? 'active' : ''}
            >
                Short break
            </button>
            <button
                onClick={() => onModeChange('long-break')}
                className={mode === 'long-break' ? 'active' : ''}
            >
                Long Break
            </button>
        </div>
    );
};

export default ModeSelector;