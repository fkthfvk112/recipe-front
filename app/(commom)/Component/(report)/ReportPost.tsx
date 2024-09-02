
import { decodeUserJwt, decodedUserInfo } from "@/app/(utils)/decodeJwt";
import ReportClient from './ReportPostClient';

export interface Report{
    domainType?:    DomainType
    domainId:       number,
    reportUserId?:   string,
    reportedUserId?: string,
    reportType?:     ReportType,
    reportPageUrl?:  string,
}

export enum DomainType{
    Board, BoardReview, Recipe, RecipeReview
}

export enum ReportType{
    SEXUAL_CONTENT, VIOLENCE_HATE, FALSE_INFORMATION, SPAM_ADS, OTHER, NO_SELECT
}

export default async function ReportPost({domainType, domainId}:Report){
    const loginUser:decodedUserInfo|undefined = await decodeUserJwt();
    if(loginUser === undefined) return;
    return(
        <ReportClient domainType={domainType} domainId={domainId}/>
    )
}