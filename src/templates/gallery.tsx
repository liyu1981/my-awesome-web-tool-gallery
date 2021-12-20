import '../global.css';

import * as FlexSearch from 'flexsearch';
import * as React from 'react';
import * as styles from './gallery.module.css';

import { findIndex, uniq } from 'lodash';
import { useEffect, useState } from 'react';

import AddBookmark from '../components/AddBookmark';
import Bookmark from '../components/Bookmark';
import ComposeDialog from '../components/GithubCompose/ComposeDialog';
import InGalleryTab from '../components/InGalleryTab';
import { InputGroup } from '@blueprintjs/core';
import Seo from '../components/seo';
import clsx from 'clsx';
import { useDebounceCallback } from '@react-hook/debounce';

export interface ToolBookmark {
  id: string;
  name: string;
  description: string;
  url: string;
  favicon: string;
  canUseWithIframe: boolean;
}

type SearchIndices = { [k: string]: FlexSearch.Index };

export default function GalleryPage(props: {
  pageContext: { allWebTools: ToolBookmark[] };
}) {
  const [tabOpen, setTabOpen] = useState(false);
  const [tabSelectedBookmark, setTabSelectedBookmark] =
    useState<ToolBookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndices, setSearchIndices] = useState<SearchIndices | null>(
    null,
  );
  const [wantedToolIndices, setWantedToolIndices] = useState<number[]>([]);
  const [composeDialogIsOpen, setComposeDialogIsOpen] = useState(false);

  const navigateInGalleryTab = (bookmark: ToolBookmark | null) => {
    if (bookmark) {
      setTabOpen(true);
      setTabSelectedBookmark(bookmark);
    } else {
      setTabOpen(false);
      setTabSelectedBookmark(null);
    }
  };

  const loadSearchIndices = async () => {
    const results = await fetch('webtool_all_index.json');
    const data: { [k: string]: { [k2: string]: string } } =
      await results.json();
    console.log('loaded data:', data);
    const nameIndex = new FlexSearch.Index({
      preset: 'performance',
      tokenize: 'forward',
    });
    const descriptionIndex = new FlexSearch.Index({
      preset: 'performance',
      tokenize: 'forward',
    });
    const indexImport = async (index: FlexSearch.Index, dataKey: string) => {
      Object.keys(data[dataKey]).forEach(key => {
        const keyArray = key.split('.');
        const k = keyArray[keyArray.length - 1];
        const indexData = data[dataKey][key];
        index.import(k, indexData);
      });
    };
    await indexImport(nameIndex, 'nameIndexData');
    await indexImport(descriptionIndex, 'descriptionIndexData');
    setSearchIndices({
      nameIndex,
      descriptionIndex,
    });
  };

  const doSearch = useDebounceCallback((searchQuery: string) => {
    if (searchIndices) {
      let results: number[] = [];
      Object.keys(searchIndices).forEach(indexKey => {
        const searchIndex = searchIndices[indexKey];
        results.push(...(searchIndex.search(searchQuery) as number[]));
      });
      results = uniq(results);
      setWantedToolIndices(results);
    } else {
      setWantedToolIndices([]);
    }
  }, 100);

  useEffect(() => {
    loadSearchIndices();
  }, []);

  const filteredWebTools =
    wantedToolIndices.length > 0
      ? props.pageContext.allWebTools.filter(
          (_webTool, index) =>
            findIndex(wantedToolIndices, i => i === index) >= 0,
        )
      : wantedToolIndices.length === 0 && searchQuery.length > 0
      ? []
      : props.pageContext.allWebTools;

  return (
    <div
      className={clsx(
        styles.galleryTopContainer,
        tabOpen ? styles.inGalleryTabOpen : '',
      )}
    >
      <div className={styles.galleryContainer}>
        <nav className={styles.nav}>
          <span className={styles.navItemContainer}>
            <InputGroup
              leftIcon="search"
              placeholder="type to search..."
              large={true}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                doSearch(e.target.value);
              }}
            />
          </span>
          <h1 className={styles.logo}>My Awesome Web Tool Gallery</h1>
          <span className={styles.navItemContainer}>
            <ComposeDialog
              isOpen={composeDialogIsOpen}
              onClose={() => setComposeDialogIsOpen(false)}
            />
            <AddBookmark
              onOpenComposeDialog={() => setComposeDialogIsOpen(true)}
            />
          </span>
        </nav>
        <div className={styles.app}>
          {filteredWebTools.map((tool, index) => (
            <Bookmark
              key={index}
              {...tool}
              navigateInGalleryTab={navigateInGalleryTab}
            />
          ))}
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
      <Seo />
    </div>
  );
}
