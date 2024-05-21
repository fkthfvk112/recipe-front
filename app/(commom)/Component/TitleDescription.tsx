import React from "react"

function TitleDescription({title, desc}:{title:string, desc:string}){


    return (
        <div className="defaultTitleContainer">
            <h1 className="menuTitle">{title}</h1>
            <div>{desc}</div>
        </div>
    )
}

export default React.memo(TitleDescription);