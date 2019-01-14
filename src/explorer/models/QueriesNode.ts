'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import { KSQLClient } from '../../client/KSQLClient';
import { Query } from '../../client/models/query';

export class QueriesNode extends NodeBase {
   
    private _client: KSQLClient;
   
    public readonly contextValue: string = "queries";

    constructor(client: KSQLClient, public eventEmitter: vscode.EventEmitter<NodeBase>) {
        super('Queries');
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
        let queries: Query[] = await this._client.getQueries();
        if(queries !== null && queries !== undefined){
            queries.forEach(element => {
            nodes.push(new NodeBase(element.id));
            });
        }

        return nodes;
    }
}