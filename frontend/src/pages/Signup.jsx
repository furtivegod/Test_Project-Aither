import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import emailValidator from 'email-validator';
import { apiClient } from '../../utils/axios';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!emailValidator.validate(email) || password !== confirmPassword) {
      return; // Prevent signup if validation fails
    }

    try {
      const response = await apiClient.post(`/auth/signup`, {
        email,
        name,
        password,
        confirmPassword,
      });

      alert("Signup Successful!!!");
      navigate('/');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!emailValidator.validate(newEmail)) {
      setEmailError('Invalid email format');
      setIsFormValid(false);
    } else {
      setEmailError('');
      setIsFormValid(password === confirmPassword);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setIsFormValid(false);
    } else {
      setPasswordError('');
      setIsFormValid(emailValidator.validate(email));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setPasswordError('Passwords do not match');
      setIsFormValid(false);
    } else {
      setPasswordError('');
      setIsFormValid(emailValidator.validate(email));
    }
  };

  // const isFormValid = emailValidator.validate(email) && password === confirmPassword;

  return (
    <div className="p-6 max-w-sm mx-auto mt-10 border rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Signup</h2>

      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <p>Email:</p>
      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailChange}
      />
      {emailError && <div className="text-red-500 mb-2">{emailError}</div>}

      <p>Name:</p>
      <input
        className="mt-2 p-2 border w-full"
        type="text"
        placeholder="Name"
        value={name}   
        onChange={handleNameChange}
      />

      <p>Password:</p>
      <input
        className="mt-2 p-2 border w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />

      <p>Confirm Password:</p>
      <input
        className="mt-2 p-2 border w-full"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onBlur={handleConfirmPasswordChange}
      />
      {passwordError && <div className="text-red-500 mb-2">{passwordError}</div>}

      <button
        className={`mt-3 bg-blue-500 text-white p-2 w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSignup}
        disabled={!isFormValid}
      >
        Sign Up
      </button>

      <div className="mt-4">
        Already have an account? <Link className="text-blue-600 underline" to="/">Login here</Link>
      </div>
    </div>
  );
}
