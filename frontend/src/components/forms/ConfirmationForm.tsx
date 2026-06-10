import { AlertTriangle } from 'react-feather';

import { buttonSize, buttonStyle } from '../../constants/constants';
import PopupWrapper from '../features/PopupWrapper';

interface FormProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: () => void;
  isPending?: boolean;
}

function ConfirmationForm({ isOpen, toggle, onSave, isPending = false }: Readonly<FormProps>) {
  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="error">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertTriangle size={28} strokeWidth={2} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delete this article?</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">This action cannot be undone.</p>
        </div>
        <div className="flex justify-between gap-3">
          <button type="button" className={`${buttonStyle.neutral} ${buttonSize.small}`} onClick={toggle} disabled={isPending}>
            Cancel
          </button>
          <button type="button" className={`${buttonStyle.error} ${buttonSize.small}`} onClick={onSave} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default ConfirmationForm;
