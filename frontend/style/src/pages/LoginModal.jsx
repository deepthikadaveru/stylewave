import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Please Login or Register</h2>
        <div className="space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose();
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-gray-500 text-sm">Cancel</button>
      </div>
    </div>
  );
}

export default LoginModal;
