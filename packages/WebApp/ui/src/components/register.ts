import { registerComponents } from "@phoria/phoria"

registerComponents({
  RichTextField: {
    loader: {
      module: () => import("./storyblok/fields/RichTextField.tsx"),
      component: (module) => module.RichTextField
    },
    framework: "react"
  }
})
