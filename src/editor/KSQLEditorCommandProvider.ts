'use strict';

import * as vscode from 'vscode';
import { KSQLClient } from '../client/KSQLClient';

export class KSQLEditorCommandProvider {

    private _client: KSQLClient;

    public constructor(client: KSQLClient) {
        this._client = client;
    }

    public async executeFile() {

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        let text = activeEditor.document.getText();

        if (text.trim() !== "") {
            try {
                await this._client.execute(text);
            }
            catch (err) {
                vscode.window.showErrorMessage(err.message);
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
                await this._client.execute(text);
            }
            catch (err) {
                vscode.window.showErrorMessage(err.message);
            }
        }
    }
}