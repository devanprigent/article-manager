// Libraries
import axios from "axios";
import { API_URLS } from "./Constants";
import { Article, ProxyResponse } from "./Types";

export const requestTypes = {
  FETCH_TAGS: "FETCH_TAGS",
  FETCH_ARTICLES: "FETCH_ARTICLES",
  ADD_ARTICLE: "ADD_ARTICLE",
  EDIT_ARTICLE: "EDIT_ARTICLE",
  DELETE_ARTICLE: "DELETE_ARTICLE",
};

async function request(
  url: string,
  method: string,
  successMsg: string,
  data?: any
) {
  const result: ProxyResponse = { error: false, message: "", data: {} };
  try {
    const response = await axios.request({
      url: url,
      method: method,
      data: data,
    });
    result.error = response.status < 200 || response.status >= 300;
    result.message = successMsg;
    result.data = response.data;
  } catch (err: any) {
    result.error = true;
    result.message = err.message;
    if (err.response) {
      result.data = err.response.data;
      result.message = result.data.message;
    }
  }
  return result;
}

async function fetchTags() {
  const url = API_URLS.GET_TAGS;
  const method = "GET";
  const sucessMsg = "Tags fetched successfully";
  return request(url, method, sucessMsg);
}

async function fetchArticles() {
  const url = API_URLS.GET_ARTICLES;
  const method = "GET";
  const sucessMsg = "Articles fetched successfully";
  return request(url, method, sucessMsg);
}

async function addArticle(article: Article) {
  const url = API_URLS.GET_ARTICLES;
  const method = "POST";
  const sucessMsg = "Article successfully added";
  return request(url, method, sucessMsg, article);
}

async function editArticle(article: Article) {
  const url = `${API_URLS.GET_ARTICLES}${article.id}/`;
  const method = "PUT";
  const sucessMsg = "Article successfully edited";
  return request(url, method, sucessMsg, article);
}

async function deleteArticle(id: number) {
  const url = `${API_URLS.GET_ARTICLES}${id}/`;
  const method = "DELETE";
  const sucessMsg = "Article successfully deleted";
  return request(url, method, sucessMsg);
}

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
): Promise<ProxyResponse> {
  switch (request) {
    case requestTypes.FETCH_TAGS: {
      return fetchTags();
    }
    case requestTypes.FETCH_ARTICLES: {
      return fetchArticles();
    }
    case requestTypes.ADD_ARTICLE: {
      const article = parameter as Article;
      return addArticle(article);
    }
    case requestTypes.EDIT_ARTICLE: {
      const article = parameter as Article;
      return editArticle(article);
    }
    case requestTypes.DELETE_ARTICLE: {
      const id = parameter as number;
      return deleteArticle(id);
    }
    default:
      throw new Error("This type of request is not supported");
  }
}
