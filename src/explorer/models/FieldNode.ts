'use strict';

import * as vscode from 'vscode';
import { NodeBase } from './nodeBase';
import { KSQLSourceDescriptionFieldSchema } from '../../client/models/KSQLSourceDescription';

export class FieldNode extends NodeBase {

    public readonly contextValue: string = "field";

    public readonly tooltip?: string;

    constructor(label:string, schema: KSQLSourceDescriptionFieldSchema) {
        super(label);
 
        this.tooltip = this.formatSchema(schema).toUpperCase();
      
    }

    private formatSchema(schema: KSQLSourceDescriptionFieldSchema) : string{
        if((schema.type === "MAP"  || schema.type === "ARRAY") && schema.memberSchema !== null) { 
            return `${schema.type} (${schema.memberSchema.type})`;
        }

        if(schema.type === "STRUCT" && schema.memberSchema !== null) {
            return schema.type;    
        }

        return schema.type;
    }

    public getTreeItem(): vscode.TreeItem {
       const treeItem = <vscode.TreeItem> {
            label: this.label,
            tooltip: this.tooltip,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            contextValue: this.contextValue
        };

        return treeItem;
    }

    
}