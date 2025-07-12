import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token } = await register(email, password);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">
          Create a new account
        </h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <p className="password-hint">
              Password must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-redirect">
          <div className="divider">
            <span>Already have an account?</span>
          </div>
          <Link to="/login" className="login-link">
            Sign in instead
          </Link>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                          url('https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          background-size: cover;
          background-position: center;
          padding: 20px;
        }
        
        .register-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(8px);
          padding: 40px;
          width: 100%;
          max-width: 450px;
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .register-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 30px;
          background: linear-gradient(90deg, #4f46e5, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .error-message {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          color: #b91c1c;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }
        
        .form-input {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
          background-color: #f8fafc;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        
        .password-hint {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        
        .submit-button {
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          color: white;
          margin-top: 10px;
        }
        
        .submit-button:hover:not(.loading) {
          background: linear-gradient(90deg, #4338ca, #6d28d9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .submit-button.loading {
          background: #94a3b8;
          cursor: not-allowed;
        }
        
        .login-redirect {
          margin-top: 30px;
          text-align: center;
        }
        
        .divider {
          position: relative;
          margin: 20px 0;
        }
        
        .divider:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #e2e8f0;
          z-index: 1;
        }
        
        .divider span {
          position: relative;
          padding: 0 10px;
          background-color: white;
          z-index: 2;
          color: #64748b;
          font-size: 14px;
        }
        
        .login-link {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .login-link:hover {
          color: #4338ca;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;