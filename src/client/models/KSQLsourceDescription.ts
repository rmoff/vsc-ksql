'use strict';


export interface KSQLSourceDescriptionResponse{
    statementText : string,
    sourceDescription: KSQLSourceDescription
}


export interface KSQLSourceDescription {
    statementText : string,
    name: string,
    type: string,
    format: string,
    key: string,
    timestamp:string,
    topic:string,
    readQueries: string[],
    writeQueries: string[],
    statistics: string,
    errorStats: string,
    replication: number,
    partitions: number,
    extended: boolean,
    fields : KSQLSourceDescriptionField[]
}

export interface KSQLSourceDescriptionField{
    name :string,
    schema: KSQLSourceDescriptionFieldSchema
}

export interface KSQLSourceDescriptionFieldSchema{
    type: string,
    memberSchema: any,
    fields: any
}