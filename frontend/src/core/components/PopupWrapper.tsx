import { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { motion } from 'framer-motion';

import { useIsDarkMode } from '../../contexts/ThemeContext';

interface PropsType {
  popup: boolean;
  setPopup: (value: boolean) => void;
  status: 'success' | 'error' | 'neutral';
  children: ReactNode;
}

function PopupWrapper({ popup, setPopup, status, children }: Readonly<PropsType>) {
  const isDarkMode = useIsDarkMode();
  const panelMaxHeight = 'min(90dvh, calc(100dvh - 2rem))';
  let statusClasses;

  switch (status) {
    case 'success':
      statusClasses = 'border text-green-800 border-green-300 bg-green-50 dark:text-green-300 dark:border-green-800 dark:bg-green-950/40';
      break;
    case 'error':
      statusClasses = 'border text-red-800 border-red-300 bg-red-100 dark:text-red-200 dark:border-red-700 dark:bg-red-950/90';
      break;
    case 'neutral':
    default:
      statusClasses = 'border text-gray-800 border-gray-300 bg-gray-50 dark:text-slate-100 dark:border-slate-700 dark:bg-slate-900';
      break;
  }

  return (
    <Modal
      open={popup}
      onClose={() => setPopup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        overflow: 'hidden',
        '& .MuiBackdrop-root': {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.55)',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 2rem), 28rem)',
        }}
      >
        <Box sx={{ outline: 'none' }}>
          <div
            id="alert-additional-content-3"
            className={`${statusClasses} overflow-y-auto rounded-lg select-none p-4 shadow-lg dark:shadow-black/40`}
            style={{ maxHeight: panelMaxHeight }}
            role="alert"
          >
            {children}
          </div>
        </Box>
      </motion.div>
    </Modal>
  );
}

export default PopupWrapper;
