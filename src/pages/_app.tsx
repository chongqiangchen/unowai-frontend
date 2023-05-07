import '@/styles/globals.css'
import Layout from '@/ui/layout'
import Head from 'next/head'
import React, { FunctionComponent, ReactElement } from 'react'

interface PageProps {
  Component: typeof React.Component & { getLayout?: FunctionComponent }
  pageProps: any
}

const Heads = () => (
  <Head>
    <title>IQS eCommerce</title>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <link rel="icon" href="/favicon.png" />
  </Head>
)

export default function Page({ Component, pageProps }: PageProps) {
  const renderWithLayout =
    Component.getLayout ??
    function (page: ReactElement) {
      return <Layout>{page}</Layout>
    }

  return (
    <>
      <Heads />
      {renderWithLayout(<Component {...pageProps} />)}
    </>
  )
}
