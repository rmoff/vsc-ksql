'use strict';

import { window, ViewColumn, OutputChannel } from 'vscode';
import { KSQLClient } from '../client/KSQLClient';
import { IncomingMessage } from 'http';

export class SelectOutputChannelWriter {

    private readonly _client: KSQLClient;

    private readonly _channel: OutputChannel;


    private _message?: IncomingMessage;

    constructor(client: KSQLClient, channel: OutputChannel) {
        this._client = client;
        this._channel = channel;
        this._channel.show(true);
    }

    public async select(ksql: string) {

        const panel = window.createWebviewPanel(
            'KSQL',
            'SELECT OUTPUT',
            ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = this.content();

        var regex = /((?:\{"row"){1}(?:.+?)(?:"finalMessage":(?:.+?)\}){1})/g
        await this._client.select(ksql, (chunk: any) => {
            if (typeof chunk === "string") {
                panel.webview.postMessage({ update: chunk });
            }

            if (chunk instanceof Buffer) {
                var raw = chunk.toString();
                var match = raw.match(regex);
                if (match) {

                    var rows = raw.split(regex);
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
                                panel.webview.postMessage(row);
                            }
                        }
                    });
                }
            }
        });
    }

    private content(): string {
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
                
                table td, table th {
                    padding: 4px 20px 4px 2px;
                }
            </style>
            <body>
                <table id="content">
                    <tr>
                        <th>#</th>
                        <th>ROWTIME</th>
                        <th>ROWKEY</th>
                        <th>VIEWTIME</th>
                        <th>USERID</th>
                        <th>PAGEID</th>
                    </tr>
                </table>
                <p id="final"></p>
            </body>
            <script>
                const final = document.getElementById('final');
                const content = document.getElementById('content');

                window.addEventListener('message', event => {
                    const message = event.data; // The JSON data our extension sent
                    
                    if(message.row) {
                        var row = document.createElement("tr");
                        
                        var column = document.createElement("td");
                        column.innerText = content.childElementCount;
                        row.appendChild(column);
                        
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