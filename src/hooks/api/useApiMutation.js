import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";

/**
 * Custom Generic Reusable React Query Mutation Hook (POST, PUT, PATCH, DELETE)
 *
 * @param {Object} mutationConfig
 * @param {string|Function} mutationConfig.endpoint - API endpoint or function returning endpoint based on variables
 * @param {'post'|'put'|'patch'|'delete'} [mutationConfig.method='post'] - HTTP method
 * @param {Array|Function} [mutationConfig.invalidateKeys=[]] - Query keys to automatically invalidate on success
 * @param {Object} [mutationConfig.headers={}] - Custom headers
 * @param {Object} [mutationConfig.config={}] - Extra axios options (e.g. isFormData, returnFullResponse)
 * @param {Object} [mutationOptions={}] - TanStack React Query mutation options (e.g. onSuccess, onError)
 * @returns {import('@tanstack/react-query').UseMutationResult}
 *
 * @example
 * const { mutate: createParty, isPending } = useApiMutation({
 *   endpoint: ENDPOINTS.PARTIES.CREATE,
 *   method: 'post',
 *   invalidateKeys: [['parties']],
 * });
 *
 * // Dynamic endpoint example (Update):
 * const { mutate: updateParty } = useApiMutation({
 *   endpoint: (vars) => ENDPOINTS.PARTIES.UPDATE(vars.id),
 *   method: 'put',
 *   invalidateKeys: (data, vars) => [['parties'], ['parties', vars.id]],
 * });
 */
export const useApiMutation = (
  {
    endpoint,
    method = "post",
    invalidateKeys = [],
    headers = {},
    config = {},
  } = {},
  mutationOptions = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      // Allow variables to be either the direct payload OR a structured object { payload, params, headers, config, id, ... }
      let targetPayload = variables;
      let targetParams = {};
      let targetHeaders = { ...headers };
      let targetConfig = { ...config };

      if (
        variables &&
        typeof variables === "object" &&
        !(variables instanceof FormData) &&
        ("payload" in variables || "params" in variables)
      ) {
        targetPayload = variables.payload !== undefined ? variables.payload : null;
        targetParams = variables.params || {};
        if (variables.headers) targetHeaders = { ...targetHeaders, ...variables.headers };
        if (variables.config) targetConfig = { ...targetConfig, ...variables.config };
      }

      // Dynamic endpoint resolution
      const targetEndpoint =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;

      if (!targetEndpoint) {
        throw new Error("useApiMutation: 'endpoint' is required.");
      }

      return apiRequest({
        method,
        endpoint: targetEndpoint,
        payload: targetPayload,
        params: targetParams,
        headers: targetHeaders,
        config: targetConfig,
      });
    },

    onSuccess: (data, variables, context) => {
      // Automatic Cache Invalidation
      if (invalidateKeys) {
        const keysToInvalidate =
          typeof invalidateKeys === "function"
            ? invalidateKeys(data, variables)
            : invalidateKeys;

        if (Array.isArray(keysToInvalidate)) {
          keysToInvalidate.forEach((key) => {
            if (key) {
              queryClient.invalidateQueries({
                queryKey: Array.isArray(key) ? key : [key],
                exact: false,
              });
            }
          });
        }
      }

      // Trigger caller's custom onSuccess if provided
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context);
      }
    },
    ...mutationOptions,
  });
};

export default useApiMutation;
