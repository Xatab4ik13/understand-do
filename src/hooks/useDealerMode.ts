import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDealerMode } from "@/lib/api/dealer.functions";

export const DEALER_QUERY_KEY = ["dealer-mode"] as const;

export function useDealerMode() {
  const { data } = useQuery({
    queryKey: DEALER_QUERY_KEY,
    queryFn: () => getDealerMode(),
    staleTime: 5 * 60 * 1000,
  });
  return data?.dealer === true;
}

export function useInvalidateDealerMode() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: DEALER_QUERY_KEY });
}
