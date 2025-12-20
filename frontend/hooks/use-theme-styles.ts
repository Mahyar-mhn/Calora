"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function useThemeStyles() {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === "dark") {
      // Apply dark theme styles to all elements with inline styles
      const styleOverrides = `
        /* Dark theme - Background palette: #1B3C53, #234C6A, #456882, #D2C1B6 */
        .dark [style*="background: #E7F2EF"],
        .dark [style*="background-color: #E7F2EF"],
        .dark [style*="background: #FFF9E5"],
        .dark [style*="background-color: #FFF9E5"],
        .dark [style*="background: #FFFFFF"],
        .dark [style*="background-color: #FFFFFF"] {
          background-color: #234C6A !important;
        }
        
        /* Dark theme - Chart palette: #2C3930, #3F4F44, #A27B5C, #DCD7C9 */
        .dark [style*="fill: #63A361"],
        .dark [style*="fill: #FFC50F"],
        .dark [style*="fill: #5B532C"],
        .dark [style*="fill: #4A9782"] {
          fill: #A27B5C !important;
        }
        
        .dark [style*="stroke: #63A361"],
        .dark [style*="stroke: #FFC50F"],
        .dark [style*="stroke: #5B532C"],
        .dark [style*="stroke: #4A9782"] {
          stroke: #A27B5C !important;
        }
        
        /* Dark theme - Form palette: #432323, #2F5755, #5A9690, #E0D9D9 */
        .dark [style*="background: #4A9782"],
        .dark [style*="background-color: #4A9782"] {
          background-color: #5A9690 !important;
          color: #E0D9D9 !important;
        }
      `
      
      // Inject styles if not already present
      if (!document.getElementById("dark-theme-overrides")) {
        const styleSheet = document.createElement("style")
        styleSheet.id = "dark-theme-overrides"
        styleSheet.textContent = styleOverrides
        document.head.appendChild(styleSheet)
      }
    } else {
      // Remove dark theme overrides
      const styleSheet = document.getElementById("dark-theme-overrides")
      if (styleSheet) {
        styleSheet.remove()
      }
    }
  }, [theme])
}







