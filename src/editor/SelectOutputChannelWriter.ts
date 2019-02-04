'use strict';

import { window, ViewColumn, OutputChannel, WebviewPanel } from 'vscode';
import { KSQLClient } from '../client/KSQLClient';
import { IncomingMessage } from 'http';
import { KSQLQueryDescription } from '../client/models/KSQLQueryDescription';

export class SelectOutputChannelWriter {

    private readonly _client: KSQLClient;

    private readonly _channel: OutputChannel;

    private _panel?: WebviewPanel;

    private _message?: IncomingMessage;

    constructor(client: KSQLClient, channel: OutputChannel) {
        this._client = client;
        this._channel = channel;
        this._channel.show(true);
    }

    public async select(ksql: string) {

        await this.setContent(ksql);

        await this._client.select(ksql, (chunk: any) => {
            if (typeof chunk === "string") {
                this.addChunk(chunk);
            }

            if (chunk instanceof Buffer) {
                this.addChunk(chunk.toString());
            }
        });
    }

    private async setContent(ksql: string) {
        const explain = await this._client.expain(ksql);
        if(explain){
            this._panel = window.createWebviewPanel(
                'KSQL',
                'SELECT OUTPUT',
                ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            this._panel.webview.html = this.getContent(explain.queryDescription);
        }
    }

    private addChunk(chunk: string) {
        var regex = /((?:\{"row"){1}(?:.+?)(?:"finalMessage":(?:.+?)\}){1})/g
        var match = chunk.match(regex);
        if ( match) {

            var rows = chunk.split(regex);
            rows.forEach(t => {
                if (t && t.trim() !== "") {
                    var row;
                    try {
                        row = JSON.parse(t.trim());
                    } catch (e) {
                        console.error(t);
                        console.error(e.message);
                    }

                    if (this._panel && row) {
                        this._panel.webview.postMessage(row);
                    }
                }
            });
        }
    }

    private getContent(d: KSQLQueryDescription): string {
        return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>KSQL</title>
                </head>
                <style>
                    table {
                        text-align: left;
                    
                    .header {
                        padding: 4px 20px 4px 2px;
                    }
                </style>
            
            <body>
                <table>
                    <thead>
                        <tr>
                            ${d.fields.map(field => `<th class="header">${field.name}</th>`).join("\n")}
                        </tr>
                    </thead>
                    <tbody id="content"></tbody>
                </table>
                <p id="final"></p>
            </body>
            <script>
                const final = document.getElementById('final');
                const content = document.getElementById('content');

                window.addEventListener('message', event => {
                    const message = event.data;
                    
                    if(message.row) {
                        var row = document.createElement("tr");
                        
                        message.row.columns.forEach(c => {
                            var column = document.createElement("td");
                            column.innerText = c;
                            row.appendChild(column);
                        });

                        content.appendChild(row);
                    }

                    if(message.finalMessage) {
                        var finalize = document.createElement("p");
                        finalize.innerText = message.finalMessage;
                        final.appendChild(finalize);
                    }
                        
                });
            </script>
        </html>`;
    }
} 