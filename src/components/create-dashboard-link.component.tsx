import React from 'react';
import { DashboardExtension, type IconId } from '@openmrs/esm-framework';
import { BrowserRouter } from 'react-router-dom';

export interface DashboardLinkConfig {
  name: string;
  title: string;
  icon?: IconId;
}

function HomeDashboardLink({ dashboardLinkConfig }: { dashboardLinkConfig: DashboardLinkConfig }) {
  return (
    <DashboardExtension
      path={dashboardLinkConfig.name}
      title={dashboardLinkConfig.title}
      basePath={`${window.spaBase}/home`}
      icon={dashboardLinkConfig.icon}
    />
  );
}

export const createHomeDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () =>
  (
    <BrowserRouter>
      <HomeDashboardLink dashboardLinkConfig={dashboardLinkConfig} />
    </BrowserRouter>
  );
