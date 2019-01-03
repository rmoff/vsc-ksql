'use strict';

import { WorkspaceConfiguration, workspace, window, Uri } from 'vscode';

export class KSQLConnectionConfig {

    private get activeTextEditorUri(): string {
        if (typeof window.activeTextEditor !== 'undefined' &&
            typeof window.activeTextEditor.document !== 'undefined') {
            return window.activeTextEditor.document.uri.toString();
        }
        return '';
    }

    public getConfiguration(extensionName: string, resource?: Uri | string): WorkspaceConfiguration {
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
        return workspace.getConfiguration(extensionName, resource as Uri);
    }
}