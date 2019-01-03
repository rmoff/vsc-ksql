'use strict';

import * as vscode from 'vscode';
import { KSQLClient } from '../../client/KSQLClient';
import { NodeBase } from './nodeBase';
import { FieldNode } from './FieldNode';
import { KSQLSourceDescriptionResponse } from '../../client/models/KSQLSourceDescription';

export class TableNode extends NodeBase {

    private _client: KSQLClient;

    public readonly contextValue: string = "table";

    constructor(client: KSQLClient, label:string) {
        super(label);
        this._client = client;
    }

    public getTreeItem(): vscode.TreeItem {
       const treeItem = <vscode.TreeItem> {
            label: this.label,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: this.contextValue
        };

        return treeItem;
    }

    public async getChildren(element: NodeBase): Promise<NodeBase[]> {
        let nodes: NodeBase[] = [];
        
        let description: KSQLSourceDescriptionResponse = await this._client.describe(this.label);
        if(description !== null && description !== undefined){
            description.sourceDescription.fields.forEach(element => {
            nodes.push(new FieldNode(element.name, element.schema));
            });
        }
 
        return nodes;
    }
}