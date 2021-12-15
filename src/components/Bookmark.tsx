import * as React from 'react';
import * as styles from './Bookmark.module.css';

import { Button, ButtonGroup } from '@blueprintjs/core';

import { ToolBookmark } from '../templates/gallery';

type BookmarkProps = ToolBookmark & {
  navigateInGalleryTab: (url: ToolBookmark | null) => void;
};

export default function Bookmark(props: BookmarkProps) {
  const openBookmarkInNewTab = () => {
    window.open(props.url, '_blank');
  };

  return (
    <div className={styles.bookmarkContainer}>
      <div className={styles.bookmark} onClick={openBookmarkInNewTab}>
        <div className={styles.bookmarkImg}>
          <img src={props.favicon} />
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
              text="Open in iframe"
              disabled={!props.canUseWithIframe}
              onClick={() =>
                props.navigateInGalleryTab({
                  id: props.id,
                  name: props.name,
                  description: props.description,
                  url: props.url,
                  favicon: props.favicon,
                  canUseWithIframe: props.canUseWithIframe,
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
