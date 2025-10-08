import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

interface FloatingInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ onSubmit, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="질문을 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            className="flex-1 h-12 text-base"
          />
          <Button 
            type="submit" 
            disabled={disabled || !message.trim()}
            size="lg"
            className="h-12 px-6"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FloatingInput;

