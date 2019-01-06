'use strict';

import * as vscode from 'vscode';
import { KSQLReserved } from '../utils/KSQLKeywords';

export class KSQLFormatter implements vscode.DocumentFormattingEditProvider {

     public static readonly KeywordRegex: RegExp = new RegExp("(\\b"+ KSQLReserved.join("\\b|\\b")+"\\b)","ig");

    //private readonly linebreakRegex = /(CREATE\s*(STREAM|TABLE)){1}(.*)(\({1}|(AS SELECT))|\s*\w* [A-z<>]*,{1}|WITH\s*\(\s*(.*)\)?/ig;

    public provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {

        let edits: vscode.TextEdit[] = [];

        this.matchKeyword(document, KSQLFormatter.KeywordRegex, edits);
        //this.matchLinebreak(document , this.linebreakRegex, edits); still needs work

        return edits;
    }

    private matchKeyword(document: vscode.TextDocument, regex: RegExp, edits: vscode.TextEdit[]) {
        let matches: RegExpMatchArray | null;
        const text = document.getText();
        if (matches = text.match(regex)) {
            let previous = 0;
            matches.forEach(match => {
                let section = text.substring(previous);
                let offset = section.search(new RegExp("\\b" + match + "\\b", "gi")) + previous;
                if (match !== match.toUpperCase()) {
                    var range = new vscode.Range(document.positionAt(offset), document.positionAt(offset + match.length));
                    edits.push(vscode.TextEdit.replace(range, match.toUpperCase()));
                }
                previous = offset +match.length;
            });
        }
    }

    /*
    private matchLinebreak(document: vscode.TextDocument, regex: RegExp, edits: vscode.TextEdit[])  {
        let match: RegExpMatchArray | null;
        const text = document.getText();
        if (match = text.match(regex)) {
            let previous = 0;
            match.forEach(m => {
                    let offset = text.indexOf(m, previous);
                    let position = document.positionAt(offset);
                    if(!document.lineAt(position.line).text.trim().startsWith(m+"\n")) {
                        edits.push(vscode.TextEdit.insert(document.positionAt(offset+m.length), '\n'));
                    }
                    if(position.character !== 0 && document.lineAt(position.line).text.trim().startsWith(m)) {
                        edits.push(vscode.TextEdit.delete(new vscode.Range(new vscode.Position(position.line,0), document.positionAt(offset))));
                    }

                    previous = offset + m.length;
                }
            );
        }
    }*/
}