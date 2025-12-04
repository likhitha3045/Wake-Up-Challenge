import React, { useState } from 'react';

const CreateChallenge = ({ account, web3, onCreateChallenge, loading }) => {
  const [depositAmount, setDepositAmount] = useState('0.05');
  const [wakeUpHour, setWakeUpHour] = useState(8);
  const [wakeUpMinute, setWakeUpMinute] = useState(0);
  const [durationDays, setDurationDays] = useState(7);
  const [challengeType, setChallengeType] = useState('personal');
  const [friendAddresses, setFriendAddresses] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!web3) {
      alert('Web3 not initialized');
      return;
    }

    // Validate inputs
    if (depositAmount <= 0) {
      alert('Deposit amount must be greater than 0');
      return;
    }

    if (durationDays < 1 || durationDays > 365) {
      alert('Duration must be between 1 and 365 days');
      return;
    }

    // Convert time to seconds
    const wakeUpTimeInSeconds = wakeUpHour * 3600 + wakeUpMinute * 60;

    if (challengeType === 'personal') {
      await onCreateChallenge(depositAmount, wakeUpTimeInSeconds, durationDays);
    } else {
      // Social challenge - would need additional implementation
      alert('Social challenges coming soon!');
    }
  };

  return (
    <div className="create-challenge-container">
      <div className="create-challenge-box">
        <h1>Create a Challenge</h1>
        <p className="subtitle">Set your wake-up goal and deposit funds</p>

        <form onSubmit={handleSubmit} className="challenge-form">
          {/* Challenge Type */}
          <div className="form-group">
            <label>Challenge Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="personal"
                  checked={challengeType === 'personal'}
                  onChange={(e) => setChallengeType(e.target.value)}
                />
                <span>Personal Challenge</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="social"
                  checked={challengeType === 'social'}
                  onChange={(e) => setChallengeType(e.target.value)}
                />
                <span>Social Challenge (with friends)</span>
              </label>
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="form-group">
            <label>Deposit Amount (ETH)</label>
            <div className="input-group">
              <input
                type="number"
                min="0.0001"
                step="0.0001"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.1"
              />
              <span className="currency">Ξ</span>
            </div>
            <small>You will deposit this amount. Get it back if you complete the challenge!</small>
          </div>

          {/* Wake-Up Time */}
          <div className="form-group">
            <label>Daily Wake-Up Time</label>
            <div className="time-picker">
              <input
                type="number"
                min="0"
                max="23"
                value={wakeUpHour}
                onChange={(e) => setWakeUpHour(Number(e.target.value))}
                className="time-input"
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={wakeUpMinute}
                onChange={(e) => setWakeUpMinute(Number(e.target.value))}
                className="time-input"
              />
              <span>UTC</span>
            </div>
            <small>You must confirm wake-up before this time each day</small>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label>Challenge Duration (Days)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
            />
            <div className="duration-presets">
              {[1, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`preset-btn ${durationDays === days ? 'active' : ''}`}
                  onClick={() => setDurationDays(days)}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Friend Addresses (for social challenges) */}
          {challengeType === 'social' && (
            <div className="form-group">
              <label>Friend Wallet Addresses</label>
              <textarea
                value={friendAddresses}
                onChange={(e) => setFriendAddresses(e.target.value)}
                placeholder="0x... (one per line)"
                rows="4"
              />
              <small>Enter wallet addresses of friends to challenge</small>
            </div>
          )}

          {/* Summary */}
          <div className="summary-box">
            <h3>Challenge Summary</h3>
            <ul>
              <li><strong>Type:</strong> {challengeType === 'personal' ? 'Personal' : 'Social'}</li>
              <li><strong>Deposit:</strong> {depositAmount} Ξ</li>
              <li><strong>Wake-Up Time:</strong> {String(wakeUpHour).padStart(2, '0')}:{String(wakeUpMinute).padStart(2, '0')} UTC</li>
              <li><strong>Duration:</strong> {durationDays} days</li>
              <li><strong>Outcome:</strong> {durationDays} successful wake-ups = deposit returned, otherwise burned</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Creating Challenge...' : 'Create Challenge'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;
