import './popup.css';

import * as React from 'react';
import * as copyToClipboard from 'copy-to-clipboard';

import { useEffect, useState } from 'react';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import clsx from 'clsx';
import { githubGist } from 'react-syntax-highlighter/src/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { render } from 'react-dom';

SyntaxHighlighter.registerLanguage('javascript', js);

async function detectCanUseWithIframe(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    return false;
  }

  let foundContentSecurityPolicy = false;
  let foundXFrameOptions = false;
  response.headers.forEach((value, key) => {
    console.log('headers:', key, value);
    if (key === 'Content-Security-Policy' && value.length > 0) {
      foundContentSecurityPolicy = true;
    }
    if (
      key === 'X-Frame-Options' &&
      (value.toUpperCase() === 'DENY' || value.toUpperCase() === 'SAMEORIGIN')
    ) {
      foundXFrameOptions = true;
    }
  });
  return foundContentSecurityPolicy || foundXFrameOptions;
}

function Helper() {
  const [activeTabInfo, setActiveTabInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadActiveTabInfo = async () => {
    setLoading(true);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      const tab = tabs[0];
      if (tab) {
        const canUseWithIframe = await detectCanUseWithIframe(tab.url);
        setActiveTabInfo({
          name: tab.title.split(' ')[0],
          description: tab.title,
          url: tab.url,
          favicon: tab.favIconUrl,
          canUseWithIframe,
        });
      }
    }
    setLoading(false);
  };

  const copyCode = (config: string) => {
    const done = copyToClipboard(config);
    if (done) {
      setCopied(true);
      setTimeout(() => setCopied(false), 5 * 1000);
    }
  };

  const renderConfig = () => {
    const config = JSON.stringify(activeTabInfo, null, 2);
    const code = `module.exports = ${config};`;
    return (
      <>
        <div className="codeContainer">
          <SyntaxHighlighter
            language="javascript"
            style={githubGist}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <div className="codeToolbar">
          <div
            className={clsx(
              'codeToolbarCopy',
              copied ? 'codeToolbarCopyCopied' : '',
            )}
          >
            <button onClick={() => copyCode(code)}>
              {copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    loadActiveTabInfo();
  }, []);

  return <div>{loading ? 'loading...' : renderConfig()}</div>;
}

render(<Helper />, document.getElementById('root'));
