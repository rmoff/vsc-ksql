'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import { KSQLClient } from '../../client/KSQLClient';
import { Topic } from '../../client/models/topic';

export class TopicsNode extends NodeBase {
   
    private _client: KSQLClient;
   
    public readonly contextValue: string = "topics";

    constructor(client: KSQLClient, public eventEmitter: vscode.EventEmitter<NodeBase>) {
        super('Topics');
        this._client = client;
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: this.label,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: this.contextValue
        }
    }

    public async getChildren(element: NodeBase): Promise<NodeBase[]> {
        let nodes: NodeBase[] = [];
        let topics: Topic[] = await this._client.getTopics();
        if(topics !== null && topics !== undefined){
        topics.forEach(element => {
            nodes.push(new NodeBase(element.name));
            });
        }

        return nodes;
    }
}