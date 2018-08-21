'use strict';

export interface Tables {
    statementText: string,
    tables: Table[]
}

export interface Table { 
    name:string,
    topic: string,
    format: string
}