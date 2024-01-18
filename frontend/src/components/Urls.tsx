/**
 *  This file define the API's urls.
 */

const baseURL: String = "http://127.0.0.1:8000/api";

export const getArticlesURL = (): string => `${baseURL}/articles/`;
export const getWebSitesURL = (): string => `${baseURL}/websites/`;
export const getTagsURL = (): string => `${baseURL}/tags/`;
