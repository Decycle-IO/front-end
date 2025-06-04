import React, { useState } from 'react';
import Button from './Button';

interface EmailSignupProps {
  className?: string;
  buttonText?: string;
  placeholder?: string;
  tagline?: string;
}

const EmailSignup: React.FC<EmailSignupProps> = ({
  className = '',
  buttonText = 'Subscribe',
  placeholder = 'Enter your email',
  tagline = 'Stay updated on our progress',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className={`w-full ${className}`}>
      {tagline && (
        <p className="text-sm text-slate mb-2">{tagline}</p>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={isSubmitting || isSuccess}
            className="w-full px-4 py-3 rounded-md border-2 border-forest/20 focus:border-forest focus:outline-none transition-colors duration-200"
            aria-label="Email address"
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</p>
          )}
        </div>
        <Button 
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : isSuccess ? 'Subscribed!' : buttonText}
        </Button>
      </form>
    </div>
  );
};

export default EmailSignup;
