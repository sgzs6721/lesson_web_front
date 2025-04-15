import React, { useState, useEffect } from 'react';

interface HumanVerificationProps {
  onChange: (isValid: boolean) => void;
}

const HumanVerification: React.FC<HumanVerificationProps> = ({ onChange }) => {
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Generate a new math problem
  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setFirstNumber(num1);
    setSecondNumber(num2);
    setAnswer('');
    setError('');
    setIsValid(false);
    onChange(false);
  };

  // Initialize with a math problem
  useEffect(() => {
    generateMathProblem();
  }, []);

  // Handle answer change
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setAnswer(value);
      
      if (value === '') {
        setError('');
        setIsValid(false);
        onChange(false);
      } else {
        const numericAnswer = parseInt(value, 10);
        const correctAnswer = firstNumber + secondNumber;
        
        if (numericAnswer === correctAnswer) {
          setError('');
          setIsValid(true);
          onChange(true);
        } else {
          setError('答案不正确，请重试');
          setIsValid(false);
          onChange(false);
        }
      }
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    generateMathProblem();
  };

  return (
    <div className="human-verification">
      <div className="verification-problem">
        <span>{firstNumber} + {secondNumber} = ?</span>
        <button 
          type="button" 
          className="refresh-btn" 
          onClick={handleRefresh}
          style={{
            marginLeft: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#1890ff'
          }}
        >
          换一题
        </button>
      </div>
      <input
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        placeholder="请输入计算结果"
        className={`verification-input ${isValid ? 'valid' : error ? 'invalid' : ''}`}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: `1px solid ${isValid ? '#52c41a' : error ? '#f5222d' : '#d9d9d9'}`,
          marginTop: '8px'
        }}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HumanVerification;
