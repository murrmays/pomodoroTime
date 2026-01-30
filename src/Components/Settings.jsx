function  SettingsModal({soundType, setSoundType, volume,
setVolume, bgType, setBgType, 
longBreakInterval, setLongBreakInterval, onClose}){
    const sounds = [
        { id: 'ding', label: 'Ding' },
        { id: 'microwave', label: 'Microwave' },
        { id: 'digital', label: 'Digital' }
    ];

    const bgOptions = [
        { id: 'none', label: 'None' },
        { id: 'tick', label: 'Ticking' },
        { id: 'lofi', label: 'Lo-fi' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="settings-section">
                        <div className="sound-row">
                            <h3>Long break interval:</h3>
                            <div className="stepper">
                                <button 
                                    className="stepper-btn" 
                                    onClick={() => setLongBreakInterval(Math.max(1, longBreakInterval - 1))}
                                >
                                    –
                                </button>
                                
                                <div className="stepper-value">
                                    {longBreakInterval}
                                </div>
                                
                                <button 
                                    className="stepper-btn" 
                                    onClick={() => setLongBreakInterval(Math.min(10, longBreakInterval + 1))}
                                >
                                    +
                                </button>
                                </div>
                        </div>

                        <div className="sound-row">
                            <h3>Sound:</h3>
                            <div className="sounds-grid">
                                {sounds.map((sound) => (
                                    <label key={sound.id} className={`sound-option ${soundType === sound.id ? 'selected' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="sound" 
                                        value={sound.id}
                                        checked={soundType === sound.id}
                                        onChange={(e) => setSoundType(e.target.value)}
                                    />
                                    <span className="sound-label">{sound.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sound-row">
                            <h3>Background sound:</h3>
                            <div className="sounds-grid">
                                {bgOptions.map((option) => (
                                    <label 
                                    key={option.id} 
                                    className={`sound-option ${bgType === option.id ? 'selected' : ''}`}
                                    >
                                    <input 
                                        type="radio" 
                                        name="bgSound" 
                                        value={option.id}
                                        checked={bgType === option.id}
                                        onChange={(e) => setBgType(e.target.value)}
                                    />
                                    <span className="sound-label">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sound-row">
                            <h3>Volume: {Math.round(volume * 100)}%</h3>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                    </div>
                </div>

                <button className="modal-ok-btn" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default SettingsModal;