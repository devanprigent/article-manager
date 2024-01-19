// Libraries
import { useEffect, useState } from "react";
import { Article, WebSite } from "./Types";

/**
 * The role of this component is to load data from a specified URL.
 */
function FetchData(urlFetch: string): { data: Article[] | WebSite[], fetchData: () => Promise<void> } {
    const [data, setData] = useState<Article[] | WebSite[]>([]);

    async function fetchData() {
        const raw_data = await fetch(urlFetch);
        const res = await raw_data.json();
        setData(res);
    }

    useEffect(() => {
        fetchData().catch(console.error);
        // eslint-disable-next-line
    }, []);

    return { data, fetchData };
}

// Exportation
export default FetchData;
