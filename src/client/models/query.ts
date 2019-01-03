'use strict';

export interface Queries {
    statementText: string;
    queries: Query[];
}

export interface Query { 
    queryString :string;
    sinks : string;
    id: string;
}