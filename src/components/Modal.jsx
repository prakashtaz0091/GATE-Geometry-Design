import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="absolute top-1/3 left-0  w-[100vw] flex justify-center z-50"
            onClick={onClose}
        >
            <div
                className="border p-5 "
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
