import { parsePhoriaAppSettings } from "@phoria/phoria/server"
import { type UserConfig, defineConfig } from "vite"

export default defineConfig(async () => {
  const dotnetEnv = process.env.DOTNET_ENVIRONMENT ?? process.env.ASPNETCORE_ENVIRONMENT ?? "Development"
  const appsettings = await parsePhoriaAppSettings({ environment: dotnetEnv })

  return {
    root: appsettings.root,
    base: appsettings.base,
    build: {
      ssr: true,
      target: "es2022",
      copyPublicDir: false,
      emptyOutDir: true,
      outDir: `${appsettings.build.outDir}/server`,
      rollupOptions: {
        input: `${appsettings.root}/src/server.ts`
      }
    }
  } satisfies UserConfig
})
