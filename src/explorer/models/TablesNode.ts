'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import {TableNode} from './TableNode';
import { KSQLClient } from '../../client/KSQLClient';
import { Table } from '../../client/models/table';

export class TablesNode extends NodeBase {

    private _client: KSQLClient;

    public readonly contextValue: string = "tables";

    constructor(client: KSQLClient, public eventEmitter: vscode.EventEmitter<NodeBase>) {
        super('Tables');
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
        let tables: Table[] = await this._client.getTables();
        if(tables !== null && tables !== undefined){
            tables.forEach(element => {
            nodes.push(new TableNode(this._client, element.name));
            });
        }

        return nodes;
    }
}