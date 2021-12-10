import '../global.css';

import * as React from 'react';
import * as styles from './gallery.module.css';

import AddBookmark from '../components/AddBookmark';
import Bookmark from '../components/Bookmark';
import { Colors } from '@blueprintjs/core';
import InGalleryTab from '../components/InGalleryTab';
// import Seo from '../components/seo';
import clsx from 'clsx';
import { useState } from 'react';

export interface ToolBookmark {
  name: string;
  description: string;
  url: string;
  logo: string;
  canCros: boolean;
}

export default function GalleryPage(props: {
  pageContext: { allTools: ToolBookmark[] };
}) {
  const [tabOpen, setTabOpen] = useState(false);
  const [tabSelectedBookmark, setTabSelectedBookmark] =
    useState<ToolBookmark | null>(null);

  const navigateInGalleryTab = (bookmark: ToolBookmark | null) => {
    if (bookmark) {
      setTabOpen(true);
      setTabSelectedBookmark(bookmark);
    } else {
      setTabOpen(false);
      setTabSelectedBookmark(null);
    }
  };

  return (
    <div
      className={clsx(
        styles.galleryTopContainer,
        tabOpen ? styles.inGalleryTabOpen : '',
      )}
    >
      <div className={styles.galleryContainer}>
        <nav className={styles.nav}>
          <h1 className={styles.logo}>My Awesome Web Tool Gallery</h1>
        </nav>
        <div className={styles.app} style={{ backgroundColor: Colors.GRAY2 }}>
          {props.pageContext.allTools.map((tool, index) => (
            <Bookmark
              key={index}
              {...tool}
              navigateInGalleryTab={navigateInGalleryTab}
            />
          ))}
          <AddBookmark />
        </div>
      </div>
      <div className={styles.inGalleryTab}>
        {tabSelectedBookmark ? (
          <InGalleryTab
            {...tabSelectedBookmark}
            navigateInGalleryTab={navigateInGalleryTab}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
