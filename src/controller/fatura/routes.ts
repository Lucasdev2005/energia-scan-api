import { Route } from "../../utils/types/route";

export const faturaRoutes: Route[] = [
    {
        action: "extrairFatura",
        endpoint: "/fatura",
        useFile: true,
        method: "post"
    },
    {
        action: 'getFatura',
        endpoint: "/fatura",
        method: "get"
    },
    {
        action: 'chart',
        endpoint: "/chart",
        method: "get"
    }
]