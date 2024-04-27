// Libraries
import axios from "axios";
import {
  getArticlesURL
} from "./Urls";
import { Article } from "./Types";

export const requestTypes = {
  FETCH_ARTICLES: "FETCH_ARTICLES",
  ADD_ARTICLE: "ADD_ARTICLE",
  EDIT_ARTICLE: "EDIT_ARTICLE",
  DELETE_ARTICLE: "DELETE_ARTICLE",
};

/**
 * This function is the only way to communicate with the backend.
 * Each time a component needs to make a request to the backend, it should use this function.
 * @param request The type of request to be made.
 * @param parameter The parameter to be sent with the request if any.
 * @returns The response from the backend.
 */
export async function proxy(
  request: string,
  parameter?: any
): Promise<{ error: boolean; message: string; data: any }> {
    const API_ARTICLES : string = getArticlesURL();
  switch (request) {
    case requestTypes.FETCH_ARTICLES: {
      let error: boolean;
      let message: string;
      let data: Article[];
      try {
        const response = await axios.get(API_ARTICLES);
        error = response.status !== 200;
        message = "Articles fetched successfully";
        data = response.data;
      } catch (err: any) {
        error = true;
        message = err.message;
        data = [];
      }
      return { error, message, data };
    }
    case requestTypes.ADD_ARTICLE: {
      let error: boolean;
      let message: string;
      let data: any;
      try {
        const response = await axios.post(API_ARTICLES, parameter);
        error = (response.status < 200 || response.status >= 300);
        message = "Article successfully added";
      } catch (err: any) {
        error = true;
        message = err.message;
        if (err.response) {
          data = err.response.data;
          message = data.message;
        }
      }
      return { error, message, data: {} };
    }
    case requestTypes.EDIT_ARTICLE: {
      let error: boolean;
      let message: string;
      let data: any;
      try {
        const response = await axios.put(`${API_ARTICLES}${parameter.id}/`, parameter);
        error = response.status !== 200;
        message = "Article successfully edited";
      } catch (err: any) {
        error = true;
        message = err.message;
        if (err.response) {
          data = err.response.data;
          message = data.message;
        }
      }
      return { error, message, data: {} };
    }
    case requestTypes.DELETE_ARTICLE: {
      let error: boolean;
      let message: string;
      try {
        const response = await axios.delete(`${API_ARTICLES}${parameter}/`);
        error = response.status !== 204;
        message = "Article successfully deleted";
      } catch (err: any) {
        error = true;
        message = err.message;
        if (err.response) {
          message = err.response.data.message;
        }
      }
      return { error, message, data: {} };
    }
    default:
      throw new Error("This type of request is not supported");
  }
}
