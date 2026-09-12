import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";

/**
 * Custom Generic Reusable React Query GET Hook
 *
 * @param {Array|string} queryKey - Unique React Query cache key
 * @param {Object} requestConfig - Request configuration
 * @param {string|Function} requestConfig.endpoint - API endpoint string or function returning endpoint
 * @param {Object} [requestConfig.params={}] - Query parameters (e.g., pagination, search, filters)
 * @param {Object} [requestConfig.headers={}] - Custom headers
 * @param {Object} [requestConfig.config={}] - Additional axios config (e.g. returnFullResponse)
 * @param {Object} [queryOptions={}] - TanStack React Query options (e.g., enabled, select, staleTime)
 * @returns {import('@tanstack/react-query').UseQueryResult}
 *
 * @example
 * const { data: partyList, isLoading, error } = useApiQuery(
 *   ['parties', { page: 1 }],
 *   {
 *     endpoint: ENDPOINTS.PARTIES.LIST,
 *     params: { page: 1, limit: 20 },
 *   },
 *   {
 *     staleTime: 1000 * 60 * 5,
 *   }
 * );
 */
export const useApiQuery = (
  queryKey,
  { endpoint, params = {}, headers = {}, config = {} } = {},
  queryOptions = {}
) => {
  const normalizedKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery({
    queryKey: normalizedKey,
    queryFn: async ({ signal }) => {
      const targetEndpoint =
        typeof endpoint === "function" ? endpoint() : endpoint;

      if (!targetEndpoint) {
        throw new Error("useApiQuery: 'endpoint' is required.");
      }

      return apiRequest({
        method: "get",
        endpoint: targetEndpoint,
        params,
        headers,
        config: {
          signal,
          ...config,
        },
      });
    },
    ...queryOptions,
  });
};

export default useApiQuery;
