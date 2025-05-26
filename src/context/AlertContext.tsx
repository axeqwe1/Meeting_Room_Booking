import { LucideIcon } from "lucide-react";
import React, { createContext, useContext, useState } from 'react';
import CustomAlert from "../components/CustomeAlert";

interface AlertOptions {
    title:string;
    message:string;
    mode?: 'ok' | 'confirm';
    icon?: LucideIcon;
    iconColor?: string;
    iconSize?: number;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void
}

interface AlertContextType{
    showAlert: (options:AlertOptions) => void;
    hideAlert: () => void;
    alertState: AlertOptions & {isOpen:boolean}
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [alertState, setAlertState] = useState<AlertOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    mode: 'ok'
  });

  const showAlert = (option:AlertOptions) => {
    setAlertState({
        ...option,
        isOpen:true,
        mode:option.mode || 'ok'
    })
  }

  const hideAlert = () => {
    setAlertState(prev => ({...prev,isOpen:false}))
  }

    return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alertState }}>
      {children}
      {/* เราจะเรนเดอร์ Alert ที่นี่ */}
      {alertState.isOpen && (
        <CustomAlert
          title={alertState.title}
          message={alertState.message}
          mode={alertState.mode}
          icon={alertState.icon}
          iconColor={alertState.iconColor}
          iconSize={alertState.iconSize}
          confirmText={alertState.confirmText}
          cancelText={alertState.cancelText}
          onConfirm={() => {
            alertState.onConfirm?.();
            hideAlert();
          }}
          onCancel={() => {
            alertState.onCancel?.();
            hideAlert();
          }}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};