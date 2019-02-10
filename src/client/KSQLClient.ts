'use strict';

import * as http from 'typed-rest-client/HttpClient';
import { KSQLCommandResponse } from './models/KSQLCommandResponse';
import { KSQLSourceDescriptionResponse } from './models/KSQLSourceDescription';
import { Topics, Topic } from './models/topic';
import { Streams, Stream } from './models/stream';
import { Tables, Table } from './models/table';
import { Queries, Query } from './models/query';
import { Functions, Function } from './models/function';
import { KSQLRequest } from './models/KSQLRequest';
import { IncomingMessage } from 'http';
import { KSQLQueryDescriptionResponse } from './models/KSQLQueryDescription';
import { KSQLConnectionConfig } from '../KSQLConnectionConfig';

export class KSQLClient {

    private _client: http.HttpClient ;

    private _config: KSQLConnectionConfig;

    public constructor(client:http.HttpClient, config: KSQLConnectionConfig) {
        this._client = client;
        this._config = config;
    }

    private async issueCommand<T>(ksql:string): Promise<T>{
        let request: KSQLRequest = <KSQLRequest>{ ksql: ksql};
        let response: http.HttpClientResponse = await this._client.post(this._config.url+"/ksql", JSON.stringify(request),{"Content-Type":"application/vnd.ksql.v1+json; charset=utf-8"});
        let body: string = await response.readBody();
        let obj = null;
        if(body !== null){
            obj = JSON.parse(body);
        }
        return obj !== null && !obj.error_code ? Promise.resolve(obj) : Promise.reject(obj);
    }

    private propertiesFromConfig() : any {
        if(!this._config) {
            return {};
        }

        return {"ksql.streams.auto.offset.reset": this._config.streamsAutoOffsetReset };
    }

    public async select(ksql:string, callback: (chunk: any) => void) : Promise<IncomingMessage> {
        
        let request: KSQLRequest = <KSQLRequest>{ ksql: ksql, streamsProperties: this.propertiesFromConfig()};
        let response: http.HttpClientResponse = await this._client.post(this._config.url+"/query", 
        JSON.stringify(request),{"Content-Type":"application/json"}); //this seems weird - off spec
  
        response.message.on('data', callback);
        return response.message;
    } 

    public async execute(ksql:string): Promise<KSQLCommandResponse[]> {
        return await this.issueCommand<KSQLCommandResponse[]>(ksql);
    }

    public async getTopics() : Promise<Topic[]> {
        let result : Topics[] =  await this.issueCommand<Topics[]>("SHOW TOPICS;");
        return result !== null && result.length > 0 ? Promise.resolve(result[0].topics) : Promise.reject();
    }

    public async getStreams() : Promise<Stream[]> {
        let result : Streams[] =  await this.issueCommand<Streams[]>("SHOW STREAMS;");
        return result !== null && result.length > 0 ? Promise.resolve(result[0].streams) : Promise.reject();
    }

    public async getTables() : Promise<Table[]> {
        let result : Tables[] =  await this.issueCommand<Tables[]>("SHOW TABLES;");
        return result !== null && result.length > 0 ? Promise.resolve(result[0].tables) : Promise.reject();
    }

    public async getQueries() : Promise<Query[]> {
        let result : Queries[] =  await this.issueCommand<Queries[]>("SHOW QUERIES;");
        return result !== null && result.length > 0 ? Promise.resolve(result[0].queries) : Promise.reject();
    }

    public async getFunctions() : Promise<Function[]> {
        let result : Functions[] =  await this.issueCommand<Functions[]>("SHOW FUNCTIONS;");
        return result !== null && result.length > 0 ? Promise.resolve(result[0].functions) : Promise.reject();
    }

    public async explain(ksql: string) : Promise<KSQLQueryDescriptionResponse> {
        let result : KSQLQueryDescriptionResponse[] =  await this.issueCommand<KSQLQueryDescriptionResponse[]>("EXPLAIN "+ksql );
        return result !== null && result.length > 0 ? Promise.resolve(result[0]) : Promise.reject();
    }

    public async describe(entity:string) : Promise<KSQLSourceDescriptionResponse> {
        let result : KSQLSourceDescriptionResponse[] =  await this.issueCommand<KSQLSourceDescriptionResponse[]>("DESCRIBE "+entity+";" );
        return result !== null && result.length > 0 ? Promise.resolve(result[0]) : Promise.reject();
    }

    public async describeExtended(entity:string) : Promise<KSQLSourceDescriptionResponse> {
        let result : KSQLSourceDescriptionResponse[] =  await this.issueCommand<KSQLSourceDescriptionResponse[]>("DESCRIBE EXTENDED "+entity+";" );
        return result !== null && result.length > 0 ? Promise.resolve(result[0]) : Promise.reject();
    }

    public async dropTable(table:string) : Promise<KSQLCommandResponse> {
        let result : KSQLCommandResponse[] =  await this.issueCommand<KSQLCommandResponse[]>("DROP TABLE "+table+";" );
        return result !== null && result.length > 0 ? Promise.resolve(result[0]) : Promise.reject();
    }

    public async dropStream(stream:string) : Promise<KSQLCommandResponse> {
        let result : KSQLCommandResponse[] =  await this.issueCommand<KSQLCommandResponse[]>("DROP STREAM "+stream+";" );
        return result !== null && result.length > 0 ? Promise.resolve(result[0]) : Promise.reject();
    }
}