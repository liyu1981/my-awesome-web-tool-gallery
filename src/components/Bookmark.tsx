import * as React from 'react';
import * as styles from './Bookmark.module.css';

import { Button, ButtonGroup } from '@blueprintjs/core';

interface BookmarkProps {
  name: string;
  description: string;
  url: string;
  logo: string;
}

export default function Bookmark(props: BookmarkProps) {
  return (
    <div className={styles.bookmarkContainer}>
      <div className={styles.bookmark}>
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
            <Button icon="application" text="Open in Dialog" />
            <Button icon="share" text="Open in New Tab" />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
