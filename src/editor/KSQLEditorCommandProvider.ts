'use strict';

import * as vscode from 'vscode';
import { KSQLClient } from '../client/KSQLClient';
import { KSQLSelectOutputWriter } from './KSQLSelectOutputWriter';

export class KSQLEditorCommandProvider {

    private _client: KSQLClient;

    private readonly _channel: vscode.OutputChannel = vscode.window.createOutputChannel("KSQL");

    private readonly _queries: KSQLSelectOutputWriter[] = [];

    public constructor(client: KSQLClient) {
        this._client = client;
    }

    public async executeFile() {

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        await this.execute(activeEditor.document.getText());
    }

    public async executeSelection() {

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        let text: string = "";
        if (!activeEditor.selection.isEmpty) {
            text = activeEditor.document.getText(activeEditor.selection);
        }
        else {
            return;
        }

        await this.execute(text);
   
    }

    private async execute(text: string){
        if (text.trim() !== "") {
            try {
                this._channel.show(true);
                this._channel.appendLine("==== EXECUTING ====");
                this._channel.appendLine(text);
                this._channel.show();
                if (text.startsWith("SELECT")) {
                    var output = new KSQLSelectOutputWriter("QUERY #" + (this._queries.length + 1), this._client);
                    this._queries.push(output);
                    await output.select(text);
                }
                else {
                    await this._client.execute(text);
                }
            }
            catch (err) {
                this._channel.appendLine("");
                this._channel.appendLine("==== ERROR ====");
                this._channel.appendLine(err.message);
            }
        }
    }
}