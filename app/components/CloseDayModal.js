import React, { useState } from "react";
import {
  LogOutIcon,
  LockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  TicketCheckIcon,
} from "lucide-react";

const CloseDayModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const correctPin = process.env.CLOSE_DAY_PIN || "1356"; // Default PIN

  const handlePinChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newPin = [...pin];

      if (value.length > 1) {
        // Handle pasted content
        const digits = value.split("").slice(0, 4);
        const updatedPin = [...pin];
        digits.forEach((digit, i) => {
          if (index + i < 4) {
            updatedPin[index + i] = digit;
          }
        });
        setPin(updatedPin);

        // Focus the next empty input or the last input
        const nextEmptyIndex = updatedPin.findIndex((digit) => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
        document.getElementById(`pin-${focusIndex}`)?.focus();
      } else {
        // Handle single digit input
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
          const nextInput = document.getElementById(`pin-${index + 1}`);
          if (nextInput) nextInput.focus();
        }
      }
    }
  };

  // Handle paste event for the entire PIN input section
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 4);

    if (digits) {
      const updatedPin = [...pin];
      digits.split("").forEach((digit, i) => {
        if (index + i < 4) {
          updatedPin[index + i] = digit;
        }
      });
      setPin(updatedPin);

      // Focus the next empty input or the last input
      const nextEmptyIndex = updatedPin.findIndex((digit) => !digit);
      const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
      document.getElementById(`pin-${focusIndex}`)?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredPin = pin.join("");
    if (enteredPin === correctPin) {
      setSuccess(true);
      setError("");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setPin(["", "", "", ""]);
      }, 2000);
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin(["", "", "", ""]);
      // Focus first input on error
      document.getElementById("pin-0")?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-3 w-full p-4 bg-white rounded-xl 
                   hover:shadow-md transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <TicketCheckIcon className="w-5 h-5 text-red-500" />
        </div>
        <span className="text-sm font-medium text-gray-700">
          Close This Day
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2">
            <LockIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Enter PIN to Close Day</h2>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {success ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2Icon className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">
                Day closed successfully!
              </p>
            </div>
          ) : (
            <>
              <div className="flex space-x-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={4} // Increased to allow paste
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    className="w-12 h-12 text-center text-2xl font-bold border-2 rounded-xl 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                             outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <XCircleIcon className="w-4 h-4 text-red-600" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 
                           rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={pin.some((digit) => !digit)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white 
                           font-medium py-2 px-4 rounded-xl transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify PIN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloseDayModal;
