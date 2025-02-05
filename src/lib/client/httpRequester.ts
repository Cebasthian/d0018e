async function get(url: string) {
    return fetch(url, {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

function post(url: string, body: unknown) {
    return fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

async function put(url: string, body: unknown) {
    return fetch(url, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

async function del(url: string, body?: unknown) {
    return fetch(url, {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined,
    })
}

export const http = {
    get,
    post,
    put,
    delete: del,
}