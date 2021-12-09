import * as React from 'react';
import * as bookmarkStyles from './Bookmark.module.css';
import * as styles from './AddBookmark.module.css';

import { Icon } from '@blueprintjs/core';
import clsx from 'clsx';

export default function AddBookmark(_props: any) {
  return (
    <div className={clsx(bookmarkStyles.bookmark, styles.bookmarkAdd)}>
      <div className={bookmarkStyles.bookmarkImg}>
        <Icon icon="add" iconSize={32} />
      </div>
      <div>
        <label className={clsx(bookmarkStyles.bookmarkName)}>
          Add New Tool
        </label>
      </div>
    </div>
  );
}
