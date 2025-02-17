import { useEffect, useState } from "react";
import useSWR from "swr";
import { CustomerFromSessionType } from "../server/session/session_routes";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const fetcher = (...args) => fetch(...args).then(res => res.json())

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