'use strict';

import { workspace, window, WorkspaceConfiguration, Uri } from 'vscode';

export class KSQLConnectionConfig {
  
    private readonly _extension: string = "ksql";
    private _config: WorkspaceConfiguration;

    get url(): string {
        return this._config.get<string>("url","http://localhost:8088"); 
    }

    get streamsAutoOffsetReset(): string {
        return this._config.get<string>("streamsAutoOffsetReset","latest"); 
    }
     
    public constructor() {
       this._config = this.getConfiguration();
       workspace.onDidChangeConfiguration(() => this._config = this.getConfiguration());
    }

    private get activeTextEditorUri(): Uri | string {
        if (typeof window.activeTextEditor !== 'undefined' &&
            typeof window.activeTextEditor.document !== 'undefined') {
            return window.activeTextEditor.document.uri.toString();
        }
        return '';
    }

    private getConfiguration(resource?: Uri | string): WorkspaceConfiguration{
        if (resource === 'undefined' || resource === null) {
            resource = this.activeTextEditorUri;
        }
        if (typeof resource === 'string') {
            try {
                resource = Uri.parse(resource);
            } catch (e) {
                resource = undefined;
            }
        }
    
        return workspace.getConfiguration(this._extension, resource as Uri);
    }
}