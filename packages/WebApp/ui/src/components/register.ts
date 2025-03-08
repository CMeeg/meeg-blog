import { registerComponents } from "@phoria/phoria"

registerComponents({
  Counter: {
    loader: {
      module: () => import("./Counter/Counter.tsx"),
      component: (module) => module.Counter
    },
    framework: "react"
  }
})
