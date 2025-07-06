import styles from "./ModalOrdenar.module.css";
import { useEffect } from "react";

const ModalOrdenar = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  total,
}: any) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
        <span>Total a pagar: {total}</span>
        <div className={styles.actions}>
          <button onClick={onConfirm} className={styles.confirm}>
            Confirmar
          </button>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOrdenar;
