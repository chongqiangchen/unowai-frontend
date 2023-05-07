import SiteContentWrapper from '@/ui/layout/site-content-wrapper'
import SiteFooter from '@/ui/layout/site-footer'
import SiteHeader from '@/ui/layout/site-header'
import { ConfigProvider, StyleProvider } from '@/ui/external/antd'
import React, { FunctionComponent, ReactNode } from 'react'

const RootLayout: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
  <ConfigProvider theme={{}}>
    <StyleProvider hashPriority="high">
        <div className="flex flex-col h-[100vh]">
          <SiteHeader />
          <SiteContentWrapper>{children}</SiteContentWrapper>
          <SiteFooter />
        </div>
    </StyleProvider>
  </ConfigProvider>
)

// noinspection JSUnusedGlobalSymbols
export default RootLayout
