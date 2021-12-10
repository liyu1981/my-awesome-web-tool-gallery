import * as React from 'react';
import * as bookmarkStyles from './Bookmark.module.css';
import * as styles from './AddBookmark.module.css';

import { Icon } from '@blueprintjs/core';
import clsx from 'clsx';

interface AddBookmarkProps {}

export default function AddBookmark(_props: AddBookmarkProps) {
  return (
    <>
      <div
        className={bookmarkStyles.bookmarkContainer}
        onClick={() => {
          window.open(
            'https://github.com/liyu1981/my-awesome-web-tool-gallery#add-new-tool',
            '_blank',
          );
        }}
      >
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
      </div>
    </>
  );
}
