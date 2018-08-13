'use strict';

export interface KSQLsourceDescription {
    statementText : string,
    name: string,
    type: string,
    format: string,
    key: string,
    timestamp:string,
    topic:string,
    schema : KSQLsourceDescriptionField[]
}

export interface KSQLsourceDescriptionField{
    name :string,
    type: string
}