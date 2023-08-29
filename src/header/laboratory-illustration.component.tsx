import React from 'react';
import { Microscope } from '@carbon/react/icons';
import styles from './laboratory-header.scss';

const LaboratoryIllustration: React.FC = () => {
  return (
    <div className={styles.svgContainer}>
      <Microscope className={styles.iconOverrides} />
    </div>
  );
};

export default LaboratoryIllustration;
