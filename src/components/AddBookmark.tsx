import * as React from 'react';
import * as bookmarkStyles from './Bookmark.module.css';
import * as styles from './AddBookmark.module.css';

import { Dialog, Icon } from '@blueprintjs/core';

import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { useState } from 'react';

interface AddBookmarkProps {}

const addBookmarkInstructions = `
You can suggest to add a new web tool here with following steps

1. fork the [source of this tool](https://github.com/liyu1981/my-awesome-web-tool-gallery)
   on github.
2. follow the instructions of
   [Add new tool](https://github.com/liyu1981/my-awesome-web-tool-gallery#add-new-tool),
   test and then send out a pull request.
3. after your pull request is merged, the tool you suggested will be shown here
   after next build.
`;

export default function AddBookmark(_props: AddBookmarkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={bookmarkStyles.bookmarkContainer}
        onClick={() => setIsOpen(true)}
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
      <Dialog
        isOpen={isOpen}
        icon="add"
        title="Want to add a new web tool here?"
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.dialogBody}>
          <ReactMarkdown>{addBookmarkInstructions}</ReactMarkdown>
        </div>
      </Dialog>
    </>
  );
}
