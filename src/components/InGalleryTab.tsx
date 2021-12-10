import * as React from 'react';
import * as styles from './InGalleryTab.module.css';

import { useEffect, useState } from 'react';

import { Button } from '@blueprintjs/core';
import { ToolBookmark } from '../templates/gallery';

interface InGalleryTabProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  navigateInGalleryTab: (url: ToolBookmark | null) => void;
}

export default function InGalleryTab(props: InGalleryTabProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  useEffect(() => {
    setTimeout(() => setIframeUrl(props.url), 500);
  }, []);

  return (
    <div>
      <div className={styles.locationBarContainer}>
        <Button
          icon="cross"
          minimal={true}
          onClick={() => props.navigateInGalleryTab(null)}
        />
        <span className={styles.locationBar}>
          <img src={props.logo} />
          <span>
            <b>{props.name}</b>
          </span>
          <span>{props.url}</span>
        </span>
      </div>
      <div>{iframeUrl ? <iframe src={props.url}></iframe> : ''}</div>
    </div>
  );
}
