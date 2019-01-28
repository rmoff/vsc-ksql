'use strict';

import * as vscode from 'vscode';
import { KSQLClient } from '../client/KSQLClient';
import { SelectOutputChannelWriter } from './SelectOutputChannelWriter';

export class KSQLEditorCommandProvider {

    private _client: KSQLClient;

    private readonly _channel: vscode.OutputChannel = vscode.window.createOutputChannel("KSQL");

    public constructor(client: KSQLClient) {
        this._client = client;
    }

    public async executeFile() {

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        let text = activeEditor.document.getText();
        this._channel.clear();
        if (text.trim() !== "") {
            try {
                this._channel.appendLine("==== EXECUTING ====");
                this._channel.appendLine(text);
                this._channel.show();
                await this._client.execute(text);
                this._channel.appendLine("");
                this._channel.appendLine("==== SUCCESS ====");
            }
            catch (err) {
                this._channel.appendLine("");
                this._channel.appendLine("==== ERROR ====");
                this._channel.appendLine(err.message);
            }
        }
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

        if (text.trim() !== "") {
            try {
                this._channel.appendLine("==== EXECUTING ====");
                this._channel.appendLine(text);
                this._channel.show();
                if (text.startsWith("SELECT")) {
                    var output = new SelectOutputChannelWriter(this._client, this._channel);
                    await output.select(text);
                }
                else {
                    await this._client.execute(text);
                }

                this._channel.appendLine("");
                this._channel.appendLine("==== SUCCESS ====");
            }
            catch (err) {
                this._channel.appendLine("");
                this._channel.appendLine("==== ERROR ====");
                this._channel.appendLine(err.message);
            }
        }
    }
}