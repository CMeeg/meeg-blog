import AppInsightsContextProvider from '~/components/AppInsights/ContextProvider'
import '~/styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppInsightsContextProvider>
      <Component {...pageProps} />
    </AppInsightsContextProvider>
  )
}
export default MyApp
