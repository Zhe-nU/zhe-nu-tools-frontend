"use client"

import { TanStackDevtools } from "@tanstack/react-devtools"
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools"

export const FormDevtoolsProvider = () => {
  return <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
}
