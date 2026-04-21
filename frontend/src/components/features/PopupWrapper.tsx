import { ReactNode } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

interface PropsType {
  popup: boolean;
  setPopup: (value: boolean) => void;
  status: 'success' | 'error' | 'neutral';
  children: ReactNode;
}

function PopupWrapper({ popup, setPopup, status, children }: Readonly<PropsType>) {
  let statusClasses;

  switch (status) {
    case 'success':
      statusClasses = 'text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800';
      break;
    case 'error':
      statusClasses = 'text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800';
      break;
    case 'neutral':
    default:
      statusClasses = 'text-gray-800 border-gray-300 bg-gray-50 dark:text-slate-100 dark:border-slate-700 dark:bg-slate-900';
      break;
  }

  return (
    <Modal
      open={popup}
      onClose={() => setPopup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="overflow-auto"
    >
      <motion.div initial={{ y: '-100vh', opacity: 0 }} animate={{ y: '5vh', opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '70%',
            maxHeight: '70%',
          }}
        >
          <div id="alert-additional-content-3" className={`${statusClasses} rounded-lg select-none p-4`} role="alert">
            {children}
          </div>
        </Box>
      </motion.div>
    </Modal>
  );
}

export default PopupWrapper;
