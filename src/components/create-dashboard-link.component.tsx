import React, { useMemo } from 'react';
import { ConfigurableLink } from '@openmrs/esm-framework';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface DashboardLinkConfig {
  name: string;
  title: string;
}

function DashboardExtension({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  const { t } = useTranslation();
  const { name, title } = dashboardLinkConfig;
  const location = useLocation();
  const spaBasePath = `${window.spaBase}/home`;

  const isActive = useMemo(() => {
    const pathSegments = location.pathname.split('/').map((segment) => decodeURIComponent(segment));
    return pathSegments.includes(name);
  }, [location.pathname, name]);

  return (
    <ConfigurableLink
      to={`${spaBasePath}/${name}`}
      className={`cds--side-nav__link ${isActive && 'active-left-nav-link'}`}
    >
      {t(title)}
    </ConfigurableLink>
  );
}

export const createHomeDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () =>
  (
    <BrowserRouter>
      <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
    </BrowserRouter>
  );
