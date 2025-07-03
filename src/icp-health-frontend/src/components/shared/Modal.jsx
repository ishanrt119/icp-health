// shared/Modal.jsx
import React from 'react';
import './modal.css';
import { X } from 'lucide-react';

const Modal = ({ title, children, onClose, wide = false }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${wide ? 'modal-wide' : ''}`}>
        <button className="modal-close-icon" onClick={onClose}>
          <X size={20} />
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
