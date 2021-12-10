import * as React from 'react';
import * as styles from './Bookmark.module.css';

import { Button, ButtonGroup } from '@blueprintjs/core';

import { ToolBookmark } from '../templates/gallery';

interface BookmarkProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  canCros: boolean;
  navigateInGalleryTab: (url: ToolBookmark | null) => void;
}

export default function Bookmark(props: BookmarkProps) {
  const openBookmarkInNewTab = () => {
    window.open(props.url, '_blank');
  };

  return (
    <div className={styles.bookmarkContainer}>
      <div className={styles.bookmark} onClick={openBookmarkInNewTab}>
        <div className={styles.bookmarkImg}>
          <img src={props.logo} />
        </div>
        <div>
          <label className={styles.bookmarkName}>{props.name}</label>
          <div className={styles.bookmarkDescription}>{props.description}</div>
        </div>
      </div>
      <div className={styles.bookmarkOptions}>
        <div>
          <ButtonGroup fill={true} minimal={true}>
            <Button
              icon="application"
              text="Open in Dialog"
              disabled={!props.canCros}
              onClick={() =>
                props.navigateInGalleryTab({
                  name: props.name,
                  description: props.description,
                  url: props.url,
                  logo: props.logo,
                  canCros: props.canCros,
                })
              }
            />
            <Button
              icon="share"
              text="Open in New Tab"
              onClick={openBookmarkInNewTab}
            />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
