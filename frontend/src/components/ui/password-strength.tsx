import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength = ({ password, className = '' }: PasswordStrengthProps) => {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[0-9]/, text: 'One number' },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'One special character' },
  ];

  const strength = requirements.filter(req => req.regex.test(password)).length;
  const percentage = (strength / requirements.length) * 100;

  const getStrengthColor = () => {
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 40) return 'bg-orange-500';
    if (percentage <= 60) return 'bg-yellow-500';
    if (percentage <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (percentage <= 20) return 'Very Weak';
    if (percentage <= 40) return 'Weak';
    if (percentage <= 60) return 'Fair';
    if (percentage <= 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">Password Strength</span>
        <span className={`text-xs font-medium ${
          percentage <= 40 ? 'text-red-600' : 
          percentage <= 60 ? 'text-yellow-600' : 
          percentage <= 80 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-1 mt-2">
        {requirements.map((req, index) => {
          const isValid = req.regex.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {isValid ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-gray-400" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
