'use strict';



export interface KSQLQueryDescriptionResponse {
    statementText: string;
    queryDescription: KSQLQueryDescription;
}

export interface KSQLQueryDescription {
    id: string;
    statementText: string;
    fields: KSQLQueryDescriptionField[];
    sources: string[];
    sinks: any[];
    topology: string;
    executionPlan: string;
}



export interface KSQLQueryDescriptionSchema {
    type: string;
    fields?: any;
    memberSchema?: any;
}

export interface KSQLQueryDescriptionField {
    name: string;
    schema: KSQLQueryDescriptionSchema;
}
