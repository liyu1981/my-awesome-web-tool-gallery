import * as React from 'react';
import * as styles from './AddBookmark.module.css';

import { Button, Dialog } from '@blueprintjs/core';

import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface AddBookmarkProps {}

const addBookmarkInstructions = `
## You can add a new web tool here

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
      <Button
        icon="add"
        text="Add Web Tool"
        large={true}
        minimal={true}
        onClick={() => setIsOpen(true)}
      />
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.dialogBody}>
          <ReactMarkdown>{addBookmarkInstructions}</ReactMarkdown>
        </div>
      </Dialog>
    </>
  );
}
