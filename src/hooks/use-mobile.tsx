
import * as React from "react"

export const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 768,  // md
  desktop: 1024 // lg
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      setBreakpoint({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop
      })
    }

    updateBreakpoint()
    window.addEventListener("resize", updateBreakpoint)
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [])

  return breakpoint
}

export function useIsMobile() {
  const { isMobile } = useBreakpoint()
  return isMobile
}
