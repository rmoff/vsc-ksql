'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';

export class StreamNode extends NodeBase {

    public readonly contextValue: string = "stream";

    constructor(label:string) {
        super(label);
    }

    public getTreeItem(): vscode.TreeItem {
       const treeItem = <vscode.TreeItem> {
            label: this.label,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            contextValue: this.contextValue
        }

        return treeItem;
    }
}