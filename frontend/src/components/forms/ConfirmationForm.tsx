import PopupWrapper from '../features/PopupWrapper';
import { buttonSize, buttonStyle } from '../../constants/constants';

interface FormProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: () => void;
}

function ConfirmationForm({ isOpen, toggle, onSave }: Readonly<FormProps>) {
  return (
    <PopupWrapper popup={isOpen} setPopup={toggle} status="neutral">
      <div className="flex flex-col space-y-6">
        <h1 className="text-center text-2xl font-bold text-black dark:text-slate-100">{'Confirmation'}</h1>
        <div className="text-slate-700 dark:text-slate-200">{'Are you sure you want to delete this item?'}</div>
        <div className="flex flex-row justify-between">
          <button className={`${buttonStyle.error} ${buttonSize.medium}`} onClick={toggle}>
            Cancel
          </button>
          <button className={`${buttonStyle.success} ${buttonSize.medium}`} onClick={onSave}>
            Confirm
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default ConfirmationForm;
