import { fetchApi, requestMethods } from "../utils/fetchFunctions";
const endpoints = {
  new: "/new",
  delete: "/delete/",
  items: "/items",
  update: "/update",
};

export async function getItems() {
  const response = await fetchApi(`${endpoints.items}`, {
    method: requestMethods.get,
  });
  if (response.status === "ok") {
    return response.data;
  }
  // console.log(response);
}

export async function deleteItem(id) {
  const response = await fetchApi(`${endpoints.delete}/${id}`, {
    method: requestMethods.delete,
  });
  if (response.status === "ok") {
    return response.data;
  }
  console.log(response);
}

export async function newItem(url, email) {
  const response = await fetchApi(`${endpoints.new}`, {
    method: requestMethods.post,
    body: { url, email },
  });
  if (response.status === "ok") {
    return response.data;
  }
  console.log(response);
}

export async function updateItem(id) {
  const response = await fetchApi(`${endpoints.update}/${id}`, {
    method: requestMethods.post,
  });
  if (response.status === "ok") {
    return response.data;
  }
  console.log(response);
}
