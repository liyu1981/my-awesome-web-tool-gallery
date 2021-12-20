import * as React from 'react';

import { Button, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import {
  PersonalTokenGetter,
  WithOnAddToastProps,
  getErrorToast,
} from './ComposeDialog';
import { decrypt, encrypt } from './aesUtil';

import { useState } from 'react';
import { validateGithubPersonalToken } from './githubUtil';

type PersonalTokenProps = {
  onSetPersonalTokenGetter: (getter: PersonalTokenGetter) => void;
} & WithOnAddToastProps;

type PersonalTokenSetupProps = {
  onSetEncryptedPersonalToken: (encryptToken: string) => void;
} & WithOnAddToastProps;

type PersonalTokenDecryptProps = {
  encryptedPersonalToken: string;
  onResetPersonalToken: () => void;
  onSetPersonalTokenGetter: (getter: PersonalTokenGetter) => void;
} & WithOnAddToastProps;

const GITHUB_PERSONAL_TOKEN_KEY =
  'myawesomewebtoolgallery:github:personaltoken';

function PersonalTokenDecrypt({
  encryptedPersonalToken,
  onResetPersonalToken,
  onAddToast,
  onSetPersonalTokenGetter,
}: PersonalTokenDecryptProps) {
  const [password, setPassword] = useState('');

  const loadToken = async () => {
    let personalToken = '';
    try {
      personalToken = decrypt(encryptedPersonalToken, password);
    } catch (e) {
      console.log('error', e);
      onAddToast(getErrorToast('Password is not correct!'));
      return;
    }
    try {
      await validateGithubPersonalToken(personalToken);
    } catch (err) {
      console.log('err', err);
      onAddToast(
        getErrorToast('Stored personal token is not valid. Please re-setup.'),
      );
      return;
    }
    console.log('loaded:', personalToken);
    onSetPersonalTokenGetter(() => personalToken);
  };

  return (
    <div>
      <FormGroup
        helperText={
          <span>
            Password for loading stored your github personal token.{' '}
            <a href="#" onClick={onResetPersonalToken}>
              Forget?
            </a>
          </span>
        }
        label={<b>Password: </b>}
        labelFor="password-text-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="password-text-input"
          type="password"
          placeholder="Input at least 12 characters"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </FormGroup>
      <Button
        text="Load"
        icon="key"
        intent={Intent.PRIMARY}
        disabled={!(password.length > 0)}
        onClick={loadToken}
      />
    </div>
  );
}

function PersonalTokenSetup({
  onSetEncryptedPersonalToken,
}: PersonalTokenSetupProps) {
  const [rawToken, setRawToken] = useState('');
  const [password, setPassword] = useState('');

  const finishSetup = () => {
    const encrypted = encrypt(rawToken, password);
    window.localStorage.setItem(GITHUB_PERSONAL_TOKEN_KEY, encrypted);
    onSetEncryptedPersonalToken(encrypted);
  };

  return (
    <div>
      <FormGroup
        helperText="Your github personal token. How to get one?"
        label={<b>Github Personal Token: </b>}
        labelFor="personal-token-text-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="personal-token-text-input"
          placeholder="Paste your github personal token here."
          onChange={e => setRawToken(e.currentTarget.value)}
        />
      </FormGroup>
      <FormGroup
        helperText="Password for storing your github personal token. Keep it safe!"
        label={<b>Password: </b>}
        labelFor="password-text-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="password-text-input"
          type="password"
          placeholder="Input at least 12 characters"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </FormGroup>
      <Button
        text="Save"
        icon="floppy-disk"
        intent={Intent.PRIMARY}
        disabled={!(rawToken.length > 0 && password.length > 0)}
        onClick={finishSetup}
      />
    </div>
  );
}

export default function PersonalToken({
  onSetPersonalTokenGetter,
  onAddToast,
}: PersonalTokenProps) {
  const [encryptedPersonalToken, setEncryptedPersonalToken] = useState<
    string | null
  >(window.localStorage.getItem(GITHUB_PERSONAL_TOKEN_KEY));

  return encryptedPersonalToken ? (
    <PersonalTokenDecrypt
      encryptedPersonalToken={encryptedPersonalToken}
      onResetPersonalToken={() => {
        setEncryptedPersonalToken(null);
      }}
      onAddToast={onAddToast}
      onSetPersonalTokenGetter={onSetPersonalTokenGetter}
    />
  ) : (
    <PersonalTokenSetup
      onSetEncryptedPersonalToken={setEncryptedPersonalToken}
      onAddToast={onAddToast}
    />
  );
}
