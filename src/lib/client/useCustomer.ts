import { HttpErrorMessage } from "@/types";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { CustomerFromSessionType } from "../server/session/session_routes";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const fetcher = (...args) => fetch(...args).then(res => res.json())

export const fetcher = async (url: string) => {
    const res = await fetch(url)

    const json = await res.json();

    if(!res.ok) {
        const error = new HttpError(json, res.status)
        throw error;
    }

    return json;
}

class HttpError extends Error {
    info: HttpErrorMessage
    status: number
    
    constructor(info: HttpErrorMessage, status: number) {
        super()
        this.info = info;
        this.status = status;
    }

}

export function useCustomer(fallback?: undefined): {
    customer: CustomerFromSessionType | undefined,
    refresh: () => void
};
export function useCustomer(fallback: CustomerFromSessionType): {
    customer: CustomerFromSessionType,
    refresh: () => void
};

export function useCustomer(fallback?: CustomerFromSessionType) {
    const {data, mutate} = useSWR<CustomerFromSessionType>("/api/account", fetcher)

    const [customer, setCustomer] = useState<CustomerFromSessionType|undefined>(fallback)

    useEffect(() => {
        if(data)
            setCustomer(data)
    }, [data])

    const refresh = () => {
        mutate()
    }

    return {customer, refresh}
}

