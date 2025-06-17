import { responseFormater } from "./responseFormater";

export const getRequestTemplate = async (request, apiUrl, requireAuth = false) => {
    let url = new URL(`${apiUrl}`);
    const searchParams = new URL(request.url).searchParams;
    searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });
    let headers = {};
    if (requireAuth) {
        let authTokens = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;
        headers = {
            Authorization: `Bearer ${authTokens?.access}`,
        };
    }
    let response = await fetch(url, {
        method: request.method,
        signal: request.signal,
        headers: headers,
    }).catch((error) => {
        return { errors: { detail: "Error while getting data! Please try again." } };
    });
    return responseFormater(response);
};


export const nonGetRequestTemplate = async (request, apiUrl, requireAuth = true) => {
    let url = new URL(`${apiUrl}`);
    const searchParams = new URL(request.url).searchParams;
    searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });
    let headers = {};
    if (requireAuth) {
        let authTokens = localStorage.getItem("token")
            ? JSON.parse(localStorage.getItem("token"))
            : null;
        headers = {
            Authorization: `Bearer ${authTokens?.access}`,
        };
    }
    let formData = await request.formData();
    let response = await fetch(url, {
        method: request.method,
        signal: request.signal,
        headers: headers,
        body: formData,
    }).catch((error) => {
        return { errors: { detail: "Error while getting data! Please try again." } };
    });
    return await responseFormater(response);
};
