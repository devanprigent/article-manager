// Bibliothèques
import React from "react";
import Tableau from "./Tableau";
import Ajout from "./Ajout";
import FetchData from "./FetchData";
import { getArticlesURL } from "./Urls";

function Articles() {
    const API_URL_ARTICLES = getArticlesURL();
    const { data, fetchData } = FetchData(API_URL_ARTICLES);

    return (
        <div className="container my-4"> {/* Ajout d'un conteneur avec une marge */}
            <Ajout fetchData={fetchData} />
            <div className="mx-auto"> {/* Centrage horizontal */}
                <Tableau data={data} />
            </div>
        </div>
    );
}

export default Articles;