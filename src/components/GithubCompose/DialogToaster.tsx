import * as React from 'react';
import * as styles from './GithubCompose.module.css';

import { IToastProps, Icon } from '@blueprintjs/core';

import clsx from 'clsx';

export type IToastWithIdProps = IToastProps & { id: string };

interface DialogToasterProps {
  toasts: IToastWithIdProps[];
  onDelete: (toastId: string) => void;
}

export function DialogToaster({ toasts, onDelete }: DialogToasterProps) {
  return (
    <div>
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className={clsx(
              styles.dialogToastContainer,
              toast.intent ? styles[toast.intent] : '',
            )}
          >
            <div className={styles.dialogToast}>
              <Icon icon={toast.icon} /> {toast.message}
            </div>
            <div className={styles.dialogToastCloseBtn}>
              <Icon
                icon="trash"
                style={{ cursor: 'pointer' }}
                onClick={() => onDelete(toast.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
