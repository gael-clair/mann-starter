/**
 * Query parameters for a REST resource API request.
 */
export interface ApiQueryOptions {
  /**
   * Filter on fields to populate.
   */
  populate?: object | string;

  /**
   * Filter on fields to select.
   */
  select?: object | string;

  /**
   * Number of result items to skip.
   */
  skip?: number;

  /**
   * Sort order of result items.
   */
  sort?: object | string;

  /**
   * Maximal number of result items.
   */
  limit?: number;

  /**
   * Page of result items.
   */
  page?: {
    /**
     * Page number.
     */
    num: number;

    /**
     * Page size.
     */
    size?: number;
  };

  /**
   * If true, request result could be extracted from cache.
   */
  cache?: boolean;
}
