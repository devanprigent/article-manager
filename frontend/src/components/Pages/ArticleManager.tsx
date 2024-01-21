// Libraries
import React from "react";
import Articles from "./Articles";
import WebSites from "./WebSites";

function ArticleManager() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-7">
                    <Articles />
                </div>
                <div className="col-md-5">
                    <WebSites />
                </div>
            </div>
        </div>
    );
}

// Exportation
export default ArticleManager;