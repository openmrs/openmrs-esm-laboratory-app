import React from 'react';
import { Button, Header } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { useLayoutType } from '@openmrs/esm-framework';
import { closeOverlay, useOverlay } from './store';
import styles from './overlay.scss';

const Overlay: React.FC = () => {
  const { header, component, isOverlayOpen } = useOverlay();
  const layout = useLayoutType();
  const { t } = useTranslation();
  return (
    <>
      {isOverlayOpen && (
        <div className={layout !== 'tablet' ? styles.desktopOverlay : styles.tabletOverlay}>
          {layout !== 'tablet' ? (
            <div className={styles.desktopHeader}>
              <div className={styles.headerContent}>{header}</div>
              <Button
                className={styles.closePanelButton}
                onClick={() => closeOverlay()}
                kind="ghost"
                hasIconOnly
                iconDescription={t('close', 'Close')}
              >
                <Close size={16} />
              </Button>
            </div>
          ) : (
            <div onClick={() => closeOverlay()}>
              <Header aria-label={t('tabletOverlay', 'Tablet overlay')} className={styles.tabletOverlayHeader}>
                <Button hasIconOnly iconDescription={t('back', 'Back')}>
                  <ArrowLeft size={16} />
                </Button>
                <div className={styles.headerContent}>{header}</div>
              </Header>
            </div>
          )}
          <div>{component}</div>
        </div>
      )}
    </>
  );
};

export default Overlay;
