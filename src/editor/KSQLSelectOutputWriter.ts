'use strict';

import { window, ViewColumn, WebviewPanel } from 'vscode';
import { IncomingMessage } from 'http';
import { KSQLClient } from '../client/KSQLClient';

export class KSQLSelectOutputWriter {

    private readonly _client: KSQLClient;

    private _panel: WebviewPanel;

    private _message?: IncomingMessage;

    constructor(title: string, client: KSQLClient) {
        this._client = client;
       

        this._panel = window.createWebviewPanel(
            'HTML',
            title,
            ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            });

        this._panel.onDidDispose(() => {
            if (this._message) {
                this._message.destroy();
            }
        });

    }

    public async select(ksql: string) {

        var content = await this.getContent(ksql);
        if(!content || content === ""){
            return;
        }
        this._panel.webview.html = content;

        return this._client.select(ksql, (chunk) => {
            var rows = this.readChunk(chunk);
            if (rows) {
                rows.forEach(r => {
                    if (this._panel) {
                        this._panel.webview.postMessage(r);
                    }
                });
            }
        });
    }

    private readChunk(chunk: any): string[] {
        if (typeof chunk === "string") {
            return this.splitChunk(chunk);
        }

        if (chunk instanceof Buffer) {
            return this.splitChunk(chunk.toString());
        }

        return [];
    }

    private splitChunk(chunk: string): string[] {
        let result: string[] = [];
        var regex = /((?:\{"row"){1}(?:.+?)(?:"finalMessage":(?:.+?)\}){1})/g;
        var match = chunk.match(regex);
        if (match) {

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

                    if (row) {
                        result.push(row);
                    }
                }
            });
        }

        return result;
    }

    private async getContent(ksql: string): Promise<string> {

        const explain = await this._client.explain(ksql);
        if (explain) {
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
                                        ${explain.queryDescription.fields.map(field => `<th class="header">${field.name}</th>`).join("\n")}
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
        else {
            return "";
        }
    }
} 