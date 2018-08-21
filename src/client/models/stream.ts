'use strict';

export interface Streams {
    statementText: string,
    streams: Stream[]
}

export interface Stream { 
    name:string,
    topic: string,
    format: string
}