import '../global.css';

import * as React from 'react';
import * as styles from './index.module.css';

import AddBookmark from '../components/AddBookmark';
import Bookmark from '../components/Bookmark';
import { Colors } from '@blueprintjs/core';
// import Seo from '../components/seo';
import { allTools } from '../tools';

export default function GalleryPage() {
  return (
    <div>
      <nav className={styles.nav}>
        <h1 className={styles.logo}>Awesome Web Tool Gallery</h1>
      </nav>
      <div className={styles.app} style={{ backgroundColor: Colors.GRAY2 }}>
        {allTools.map((tool, index) => (
          <Bookmark key={index} {...tool} />
        ))}
        <AddBookmark />
      </div>
    </div>
  );
}
