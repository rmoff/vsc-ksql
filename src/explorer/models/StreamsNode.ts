'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import { StreamNode } from './StreamNode';
import { KSQLClient } from '../../client/KSQLClient';
import { Stream } from '../../client/models/stream';

export class StreamsNode extends NodeBase {

    private _client: KSQLClient;

    public readonly contextValue: string = "streams";

    constructor(client: KSQLClient, public eventEmitter: vscode.EventEmitter<NodeBase>) {
        super('Streams');
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
        let streams: Stream[] = await this._client.getStreams();
        if(streams !== null && streams !== undefined){
            streams.forEach(element => {
            nodes.push(new StreamNode(element.name));
            });
        }

        return nodes;
    }
}