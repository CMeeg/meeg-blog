import { createContext, useState, ReactNode } from 'react'
import { IApplicationInsights } from '@microsoft/applicationinsights-web'
import dynamic from 'next/dynamic'

type AppInsightsContextProviderProps = {
  children: ReactNode
}

const AppInsightsContext = createContext<IApplicationInsights | null>(null)

const AppInsightsSdk = dynamic(() => import('./Sdk'), {
  ssr: false
})

const AppInsightsContextProvider = ({
  children
}: AppInsightsContextProviderProps) => {
  const instrumentationKey =
    process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY

  const [instance, setInstance] = useState<IApplicationInsights | null>(null)

  return (
    <AppInsightsContext.Provider value={instance}>
      {instrumentationKey && (
        <AppInsightsSdk
          instrumentationKey={instrumentationKey}
          instance={instance}
          setInstance={setInstance}
        />
      )}

      {children}
    </AppInsightsContext.Provider>
  )
}

export default AppInsightsContextProvider

export { AppInsightsContext }
