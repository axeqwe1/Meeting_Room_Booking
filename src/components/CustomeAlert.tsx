import React from "react";
import ReactDOM, { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, CircleAlert, LucideIcon } from "lucide-react";
import { useScrollLock } from "../hook/useScrollLock.tsx"; // อ้างอิง path ตามโครงสร้างของคุณ

type CustomAlertProps = {
  title?: string;
  message?: string;
  mode?: "ok" | "confirm";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  okText?: string;
  icon?: React.ReactNode | LucideIcon; // รับทั้ง ReactNode และ LucideIcon
  iconColor?: string; // สีของ icon
  iconSize?: number; // ขนาดของ icon
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  title = "Alert",
  message = "",
  mode = "ok",
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = "Submit",
  cancelText = "Cancel",
  okText = "OK",
  icon, // icon ที่ผู้ใช้กำหนดเอง
  iconColor = "text-blue-500", // ค่าเริ่มต้นสีน้ำเงิน
  iconSize = 90, // ค่าเริ่มต้นขนาด 90px
}) => {
  useScrollLock()
  // ฟังก์ชันแสดง icon
  const renderIcon = () => {
    if (icon) {
      // ถ้า icon เป็น React Component
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon, {
          ...icon.props,
          size: iconSize,
          className: `${iconColor} ${icon.props.className || ''}`
        });
      }
      // ถ้า icon เป็น LucideIcon
      const IconComponent = icon as LucideIcon;
      return <IconComponent size={iconSize} className={iconColor} />;
    }
    
    // Icon เริ่มต้นตาม mode
    return mode === "ok" ? (
      <CircleAlert size={iconSize} className={iconColor} />
    ) : (
      <AlertTriangle size={iconSize} className={iconColor} />
    );
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 z-50 animate-fadeIn w-full max-w-[600px] max-h-[400px] flex align-center justify-center flex-col">
        <motion.div
          className="flex justify-center my-5"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {renderIcon()}
        </motion.div>
        <h2 className="text-5xl text-center font-semibold mb-4">{title}</h2>
        <p className="text-xl mb-6 text-center">{message}</p>

        {mode === "confirm" ? (
          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={onCancel}
              className="px-4 py-3 rounded-xl border border-gray-400 hover:bg-gray-100 hover:cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <div className="flex justify-end my-3">
            <button
              onClick={onConfirm}
              className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 w-full hover:cursor-pointer"
            >
              {okText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CustomAlert;