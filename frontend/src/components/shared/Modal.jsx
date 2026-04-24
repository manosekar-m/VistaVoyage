import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({ open, onClose, title, children, size="md" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal--${size} fade-in`} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
