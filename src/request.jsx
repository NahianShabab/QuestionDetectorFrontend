

export function customFetch({link, body, method='GET', headers={}, isFile=false, isLoginRequest=false} = {}) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    if(BACKEND_URL===undefined){
        throw new Error('Backend URL not defined!')
    }
    if (!link) throw new Error('link not given');

    if (isLoginRequest) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = new URLSearchParams(body).toString();
    } else if (body && !isFile) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
        // console.log(body);
    }
    let access_token = localStorage.getItem('access_token')
    if(access_token!==null){
        headers['Authorization'] = `Bearer ${access_token}`
    }

    const options = {
        method,
        body: body === undefined ? undefined : body,
        headers
    };
    return fetch(`${BACKEND_URL}${link}`, options);
}