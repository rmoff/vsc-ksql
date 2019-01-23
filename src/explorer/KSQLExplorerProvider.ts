'use strict';

import { TreeDataProvider, TreeItem, ProviderResult, EventEmitter, Event } from 'vscode';
import { NodeBase } from './models/nodeBase';
import { TopicsNode } from './models/TopicsNode';
import { StreamsNode } from './models/StreamsNode';
import { TablesNode } from './models/TablesNode';
import { FunctionsNode } from './models/FunctionsNode';
import { QueriesNode } from './models/QueriesNode';
import { KSQLClient } from '../client/KSQLClient';

export class KSQLExplorerProvider implements TreeDataProvider<NodeBase> {

    private _client: KSQLClient;
    
    private _topics? : TopicsNode;
    private _streams? : StreamsNode;
    private _tables? : TablesNode;
    private _functions? : FunctionsNode;
    private _queries? : QueriesNode;

    private _onDidChangeTreeData: EventEmitter<NodeBase> = new EventEmitter<NodeBase>();

    public readonly onDidChangeTreeData: Event<NodeBase> = this._onDidChangeTreeData.event;
    
    public constructor(client: KSQLClient){
        this._client = client;
    }

    public refresh() : void {

        if(this._topics !== null && this._topics !== undefined){
            this._onDidChangeTreeData.fire(this._topics);
        }

        if(this._streams !== null && this._streams !== undefined){
            this._onDidChangeTreeData.fire(this._streams);
        }

        if(this._tables !== null && this._tables !== undefined){
            this._onDidChangeTreeData.fire(this._tables);
        }

        if(this._functions !== null && this._functions !== undefined){
            this._onDidChangeTreeData.fire(this._functions);
        }

        if(this._queries !== null && this._queries !== undefined){
            this._onDidChangeTreeData.fire(this._queries);
        }
    }

    getTreeItem(element: NodeBase): TreeItem | Thenable<TreeItem> {
        return element.getTreeItem();
    }

    getChildren(element?: NodeBase | undefined): ProviderResult<NodeBase[]> {
        if (!element) {
            return this.getRootNodes();
        }
        return element.getChildren(element);
    }

    private async getRootNodes(): Promise<NodeBase[]> {
        const rootNodes: NodeBase[] = [];
        let node: NodeBase;

        node = new TopicsNode(this._client, this._onDidChangeTreeData);
        this._topics = node as TopicsNode;
        rootNodes.push(node);

        node = new StreamsNode(this._client, this._onDidChangeTreeData);
        this._streams = node as StreamsNode;
        rootNodes.push(node);

        node = new TablesNode(this._client, this._onDidChangeTreeData);
        this._tables = node as TablesNode;
        rootNodes.push(node);

        node = new FunctionsNode(this._client, this._onDidChangeTreeData);
        this._functions = node as FunctionsNode;
        rootNodes.push(node);

        node = new QueriesNode(this._client, this._onDidChangeTreeData);
        this._queries = node as QueriesNode;
        rootNodes.push(node);

        return rootNodes;
    }
}