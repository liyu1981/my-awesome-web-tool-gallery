import * as React from 'react';

import {
  Button,
  FormGroup,
  Icon,
  IconName,
  InputGroup,
  Intent,
  Label,
  Tag,
} from '@blueprintjs/core';
import {
  WithOnAddToastProps,
  WithPersonalTokenGetter,
  getErrorToast,
  getSuccessToast,
} from './ComposeDialog';
import { submitGithubFile, validateGithubRepo } from './githubUtil';
import { useEffect, useState } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { getJSHintLinterSource } from './codeMirrorJSHintLinterSource';
import { javascript } from '@codemirror/lang-javascript';
import { linter } from '@codemirror/lint';

type ComposeProps = WithPersonalTokenGetter & WithOnAddToastProps;

type ComposeRepoInputProps = WithPersonalTokenGetter & {
  value: string | null;
  onSetRepo: (repo: string) => void;
};

type ComposeSubmitButtonProps = {
  icon: IconName;
  text: string;
  disabled: boolean;
  trySubmitGithubFile: () => Promise<void>;
};

const GITHUB_REPO_KEY = 'myawesomewebtoolgallery:github:repo';

function ComposeRepoInput({
  personalTokenGetter,
  value,
  onSetRepo,
}: ComposeRepoInputProps) {
  const [repo, setRepo] = useState(value || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const validateRepo = async (newRepo: string) => {
    const isOk = await validateGithubRepo(personalTokenGetter(), newRepo);
    setIsValid(isOk);
    if (isOk) {
      onSetRepo(newRepo);
    }
  };
  const validateThenSetRepo = async (newRepo: string) => {
    validateRepo(newRepo);
    setRepo(newRepo);
  };
  useEffect(() => {
    if (value && value.length > 0) {
      validateThenSetRepo(value);
    }
  }, [value]);
  return (
    <FormGroup
      inline={true}
      helperText="Repository to commit into"
      label={<b>Repo: </b>}
      labelFor="repo-text-input"
      labelInfo="(required)"
    >
      <InputGroup
        id="repo-text-input"
        value={repo}
        placeholder="input your repository name"
        onChange={e => validateThenSetRepo(e.currentTarget.value)}
        rightElement={
          isValid ? (
            <Tag
              minimal={true}
              intent={isValid ? Intent.SUCCESS : Intent.DANGER}
            >
              <Icon icon={isValid ? 'tick' : 'cross'} />
            </Tag>
          ) : undefined
        }
        style={{ minWidth: '300px' }}
      />
    </FormGroup>
  );
}

function ComposeSubmitButton({
  icon,
  text,
  disabled,
  trySubmitGithubFile,
}: ComposeSubmitButtonProps) {
  const [working, setWorking] = useState(false);
  const clickAction = async () => {
    setWorking(true);
    await trySubmitGithubFile();
    setWorking(false);
  };

  return working ? (
    <Button loading={true} large={true} />
  ) : (
    <Button
      icon={icon}
      text={text}
      large={true}
      disabled={disabled}
      onClick={clickAction}
    />
  );
}

export default function Compose({
  personalTokenGetter,
  onAddToast,
}: ComposeProps) {
  const [fileName, setFileName] = useState('');
  const [code, setCode] = useState(`module.exports = {
  "name": "<fill_me>",
  "description": "<fill_me>",
  "url": "https://<somewhere>",
  "favicon": "https://<somewhere icon>",
  "canUseWithIframe": false // true|false
};
`);
  const [codeValid, setCodeValid] = useState(false);
  const [repo, setRepo] = useState<string | null>(null);

  useEffect(() => {
    const repo = window.localStorage.getItem(GITHUB_REPO_KEY);
    if (repo) {
      setRepo(repo);
    }
  }, []);

  const setRepoAndSave = (repo: string) => {
    setRepo(repo);
    window.localStorage.setItem(GITHUB_REPO_KEY, repo);
  };

  const trySubmitGithubFile = async (fileName: string, content: string) => {
    if (repo) {
      try {
        const commitUrl = await submitGithubFile(
          personalTokenGetter(),
          repo,
          `src/toolsData/${fileName}.js`,
          content,
        );
        onAddToast(
          getSuccessToast(
            <span>
              Done! Saved as{' '}
              <a href={commitUrl} target="_blank">
                commit
              </a>
            </span>,
          ),
        );
      } catch (err: any) {
        onAddToast(getErrorToast(err.message));
      }
    } else {
      onAddToast(getErrorToast('Setup repo first!'));
    }
  };

  return (
    <div>
      <ComposeRepoInput
        personalTokenGetter={personalTokenGetter}
        value={repo}
        onSetRepo={setRepoAndSave}
      />
      <FormGroup
        inline={true}
        helperText="File name for the config of your web tool"
        label={<b>File Name: </b>}
        labelFor="filename-text-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="filename-text-input"
          value={fileName}
          placeholder="input your name, like `awesome_tool`"
          onChange={e => setFileName(e.currentTarget.value)}
          rightElement={<Tag minimal={true}>{'.js'}</Tag>}
          style={{ minWidth: '300px' }}
        />
      </FormGroup>
      <Label>
        <b>Code: </b>
      </Label>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[
          javascript(),
          linter(getJSHintLinterSource(() => setCodeValid(true))),
        ]}
        onChange={(value, _viewUpdate) => setCode(value)}
      />
      <br />
      <ComposeSubmitButton
        icon="floppy-disk"
        text="Save To Github"
        disabled={fileName.length <= 0 || !codeValid}
        trySubmitGithubFile={() => trySubmitGithubFile(fileName, code)}
      />
    </div>
  );
}
