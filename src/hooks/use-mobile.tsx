
import { useBreakpoint } from "./use-responsive";

export function useIsMobile() {
  return useBreakpoint('md', 'down');
}

export default useIsMobile;
