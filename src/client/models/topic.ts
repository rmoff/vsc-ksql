'use strict';

export interface Topics {
    statementText: string,
    topics: Topic[]
}

export interface Topic { 
    name:string,
    registered: boolean,
    replicaInfo: number[],
    consumerCount: number,
    consumerGroupCount: number
}