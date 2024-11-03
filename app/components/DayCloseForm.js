"use client"
// bm-day-book/app/components/DayCloseForm.js
import { useState } from 'react';

export default function DayCloseForm({ onSubmit }) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pin);
    setPin('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4">
      <input
        type="password"
        placeholder="Enter 4-digit PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn-primary">Close Day</button>
    </form>
  );
}
