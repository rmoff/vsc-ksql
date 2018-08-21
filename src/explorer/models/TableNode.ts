'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';

export class TableNode extends NodeBase {

    public readonly contextValue: string = "table";

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