'use strict';

import * as vscode from 'vscode';
import * as http from 'typed-rest-client/HttpClient';
import { KSQLConnectionConfig } from './KSQLConnectionConfig';
import { KSQLClient } from './client/KSQLClient';
import { KSQLExplorerProvider } from './explorer/KSQLExplorerProvider';
import { KSQLTextDocumentContentProvider } from './preview/KSQLTextDocumentContentProvider';
import { KSQLEditorCommandProvider } from './editor/KSQLEditorCommandProvider';
import { KSQLFormatter } from './editor/KSQLFormatter';

export let ksqlExplorerProvider: KSQLExplorerProvider;
export let ksqlEditorCommandProvider: KSQLEditorCommandProvider;

export function activate(context: vscode.ExtensionContext) {

    var settings = new KSQLConnectionConfig().getConfiguration("ksql");
    
    let httpClient: http.HttpClient = new http.HttpClient("vs-code");
    let client: KSQLClient = new KSQLClient(httpClient, settings.url);

    registerEditorCommands(context,client);
    registerExplorer(context,client);
    registerPreview(context,client);
}

function registerEditorCommands(context: vscode.ExtensionContext, client: KSQLClient) {
    ksqlEditorCommandProvider = new KSQLEditorCommandProvider(client);

    vscode.commands.registerCommand('ksql.editor.execute', () => ksqlEditorCommandProvider.executeFile());
    vscode.commands.registerCommand('ksql.editor.execute_selection', () => ksqlEditorCommandProvider.executeSelection());

    vscode.languages.registerDocumentFormattingEditProvider(
        {scheme: 'file', language: 'ksql'}, 
        new KSQLFormatter());
}

function registerExplorer(context: vscode.ExtensionContext, client: KSQLClient){
    ksqlExplorerProvider = new KSQLExplorerProvider(client);
    vscode.window.registerTreeDataProvider('ksqlExplorer', ksqlExplorerProvider);
    vscode.commands.registerCommand('ksql.explorer.refresh', () => ksqlExplorerProvider.refresh());

    vscode.commands.registerCommand('ksql.explorer.describe', (node) => {
        return vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("ksql:"+node.label+"?extended=false")).then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});

    vscode.commands.registerCommand('ksql.explorer.describe_extended', (node) => {
        return vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("ksql:"+node.label+"?extended=true")).then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});
 
}

function registerPreview(context: vscode.ExtensionContext, client: KSQLClient){
    let provider = new KSQLTextDocumentContentProvider(client);
    let providerRegistrations = vscode.Disposable.from(vscode.workspace.registerTextDocumentContentProvider(KSQLTextDocumentContentProvider.scheme, provider));

    context.subscriptions.push(providerRegistrations);
}

export function deactivate() {}