'use strict';

import * as vscode from 'vscode';
import { KSQLClient } from '../client/KSQLClient';
import { KSQLSourceDescriptionResponse, KSQLSourceDescription, KSQLSourceDescriptionFieldSchema } from '../client/models/KSQLSourceDescription'

export class KSQLTextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    private _client: KSQLClient;

    static scheme = 'ksql';
    
    public constructor(client: KSQLClient){
        this._client = client;
    }

    provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
        return uri.query.indexOf("extended=true") < 0 
            ? this._client.describe(uri.path).then(this.template)
            : this._client.describeExtended(uri.path).then(this.template);
            
    }

    template(data: KSQLSourceDescriptionResponse) : string {
        let d = data.sourceDescription;
        let f = new KSQLTextDocumentFormatter();


        var partitions = d.extended ?  
        `<tr><td>Partitions</td><td> ${d.partitions}</td></tr>
         <tr><td>Replication</td><td> ${d.replication}</td></tr>` : "";

        var stats = d.extended ? 
         `<h2>Statistics</h2>
         <table><thead><tr><th></th><th style="width:100%"></th></tr></thead>
             <tbody>
                 <tr><td>Read</td><td>${d.readQueries.join("\n")}</td></tr>
                 <tr><td>Write</td><td>${d.writeQueries.join("\n")}</td></tr>
                 <tr><td>Stats</td><td>${d.statistics}</td></tr>
                 <tr><td>Error</td><td> ${d.errorStats}</td></tr>
             </tbody>
         </table>` : "";


        var html =  `<style>
                        table {
                            width: 100%;
                            text-align: left;
                        }

                        table td, table th {
                            padding: 4px 20px 4px 2px;
                        }
                    </style>
                    <body>
                        <h1>${d.name}</h1>
                        <table><thead><tr><th></th><th style="width:100%"></th></tr></thead>
                            <tbody>
                                <tr><td>Type</td><td>${d.type} (${d.format})</td></tr>
                                <tr><td>Topic</td><td> ${d.topic}</td></tr>
                                ${partitions}
                            </tbody>
                        </table>

                        <h2>Fields</h2>
                        <table><thead><tr><th>Name</th><th style="width:100%">Type</th></tr></thead>
                            <tbody>
                                ${d.fields.map(field => `<tr><td>${f.formatField(field.name, d)}</td><td>${f.formatSchema(field.schema)}</td></tr>`).join("\n")}
                            </tbody>
                        </table>
                      
                        ${stats}                        
                        
                    </body>`;

                    return html;

   }
}

class KSQLTextDocumentFormatter {

    public formatField(field:string, description:KSQLSourceDescription) : string{
        if(field === description.key){
            return `<b>${field}</b> (KEY)`;
        }

        if(field === description.timestamp){
            return `<b>${field}</b> (TIMESTAMP)`;
        }

        return field;
    }

    public formatSchema(schema: KSQLSourceDescriptionFieldSchema) : string{
        if((schema.type === "MAP"  || schema.type === "ARRAY") && schema.memberSchema !== null) { 
            return `${schema.type} (${schema.memberSchema.type})`
        }

        if(schema.type === "STRUCT" && schema.memberSchema !== null) {
            return schema.type;    
        }

        return schema.type;
    }
}