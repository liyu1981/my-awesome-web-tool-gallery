import * as React from 'react';
import * as styles from './GithubCompose.module.css';

import { Button, Dialog, IToastProps, Intent } from '@blueprintjs/core';
import { DialogToaster, IToastWithIdProps } from './DialogToaster';

import Compose from './Compose';
import PersonalToken from './PersonalToken';
import { nanoid } from 'nanoid';
import { useState } from 'react';

export type PersonalTokenGetter = () => string;
export type WithOnAddToastProps = {
  onAddToast: (toast: IToastProps) => void;
};

export type WithPersonalTokenGetter = {
  personalTokenGetter: () => string;
};

const TOAST_ID_LEN = 11;
const TOAST_TIMEOUT = 5000;

export function getSuccessToast(
  message: string | React.ReactNode,
): IToastProps {
  return {
    icon: 'tick',
    intent: Intent.SUCCESS,
    message,
  };
}

export function getErrorToast(message: string | React.ReactNode): IToastProps {
  return {
    icon: 'warning-sign',
    intent: Intent.DANGER,
    message,
  };
}

export default function ComposeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogToasts, setDialogToasts] = useState<IToastWithIdProps[]>([]);
  const [personalTokenGetter, setPersonalTokenGetter] =
    useState<PersonalTokenGetter | null>(null);

  const deleteToast = (id: string) => {
    const newToasts = dialogToasts.filter(toast => toast.id !== id);
    setDialogToasts(newToasts);
  };

  const addToast = (toast: IToastProps) => {
    const id = nanoid(TOAST_ID_LEN);
    const t = { ...toast, id: id, key: id };
    const newToasts = dialogToasts.slice(0).concat([t]);
    if (toast.intent === Intent.DANGER) {
      setTimeout(() => {
        deleteToast(t.id);
      }, toast.timeout || TOAST_TIMEOUT);
    }
    setDialogToasts(newToasts);
  };

  return (
    <>
      <Button
        text="Compose"
        minimal={true}
        onClick={() => setIsOpen(true)}
        large={true}
      />
      <Dialog
        isOpen={isOpen}
        icon="add"
        title="Add New Tool"
        onClose={() => setIsOpen(false)}
        className={styles.composeDialog}
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
      >
        <DialogToaster toasts={dialogToasts} onDelete={deleteToast} />
        <div className={styles.composeDialogContainer}>
          {personalTokenGetter ? (
            <Compose
              personalTokenGetter={personalTokenGetter}
              onAddToast={addToast}
            />
          ) : (
            <PersonalToken
              onSetPersonalTokenGetter={getter => {
                setPersonalTokenGetter(() => getter);
              }}
              onAddToast={addToast}
            />
          )}
        </div>
      </Dialog>
    </>
  );
}
