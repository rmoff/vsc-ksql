'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import { KSQLClient } from '../../client/KSQLClient';
import { Function } from '../../client/models/function';

export class FunctionsNode extends NodeBase {
   
    private _client: KSQLClient;
   
    public readonly contextValue: string = "functions";

    constructor(client: KSQLClient, public eventEmitter: vscode.EventEmitter<NodeBase>) {
        super('Functions');
        this._client = client;
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.label,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: this.contextValue
        };
    }

    public async getChildren(element: NodeBase): Promise<NodeBase[]> {
        let nodes: NodeBase[] = [];
        let queries: Function[] = await this._client.getFunctions();
        if(queries !== null && queries !== undefined){
            queries.forEach(element => {
            nodes.push(new NodeBase(element.name));
            });
        }

        return nodes;
    }
}