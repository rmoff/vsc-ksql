'use strict';

import * as vscode from 'vscode';
import * as http from 'typed-rest-client/HttpClient';
import { KSQLConnectionConfig } from './KSQLConnectionConfig';
import { KSQLClient } from './client/KSQLClient';
import { KSQLExplorerProvider } from './explorer/KSQLExplorerProvider';

export let ksqlExplorerProvider: KSQLExplorerProvider;

export function activate(context: vscode.ExtensionContext) {

    var settings = new KSQLConnectionConfig().getConfiguration("ksql");
    
    let httpClient: http.HttpClient = new http.HttpClient("vs-code")
    let client: KSQLClient = new KSQLClient(httpClient, settings.url);

    ksqlExplorerProvider = new KSQLExplorerProvider(client);
    vscode.window.registerTreeDataProvider('ksqlExplorer', ksqlExplorerProvider);
    vscode.commands.registerCommand('ksql.explorer.refresh', () => ksqlExplorerProvider.refresh());
}

export function deactivate() {}