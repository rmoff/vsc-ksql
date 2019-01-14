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

export class KSQLClient {

    private _url: string;
    private _client: http.HttpClient ;

    public constructor(client:http.HttpClient, url:string) {

        this._client = client;
        this._url = url;
    }

    private async issueCommand<T>(ksql:string): Promise<T>{
        let request: KSQLRequest = <KSQLRequest>{ ksql: ksql};
        let response: http.HttpClientResponse = await this._client.post(this._url+"/ksql", JSON.stringify(request),{"Content-Type":"application/vnd.ksql.v1+json; charset=utf-8"});
        let body: string = await response.readBody();
        let obj = null;
        if(body !== null){
            obj = JSON.parse(body);
        }
        return obj !== null ? Promise.resolve(obj) : Promise.reject(response.message);
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