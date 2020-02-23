/**
 * Parameters of a resource query.
 */
export interface ResourceQuery {
  /**
   * Maximal number of result to return.
   */
  limit: number;

  /**
   * Filter on linked fields to populate.
   */
  populate: object | string;

  /**
   * Filter on fields to return.
   */
  select: object | string;

  /**
   * Number of items to skip in result.
   */
  skip: number;

  /**
   * Sort parameter for results ordering.
   */
  sort: object | string;
}
