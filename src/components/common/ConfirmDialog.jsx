import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-4 bg-red-900/20 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-slate-300">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
