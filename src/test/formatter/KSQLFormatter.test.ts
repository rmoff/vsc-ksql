import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { workspace, Uri, WorkspaceEdit } from 'vscode';
import { KSQLFormatter } from '../../editor/KSQLFormatter';


suite('KSQLFormatter', function () {

    let repo = path.join(__dirname, '..', '..', '..');
    let fixtures = path.join(repo, 'src/test/fixtures');


    fs.readdirSync(fixtures).forEach(async file => {

        test('uppercasing - '+file, async function () {
            try {
                let original = fs.readFileSync(path.join(fixtures, file));
                assert.notEqual(original, null);

                let dir = path.join(__dirname, "uppercasing");
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                let subject = path.join(dir, file);
                fs.writeFileSync(subject, original.toString().replace(KSQLFormatter.KeywordRegex, match => { return match.toLowerCase(); }));

                let document = await workspace.openTextDocument(Uri.file(subject));

                let formatter = new KSQLFormatter();
                let edits = formatter.provideDocumentFormattingEdits(document);
                let edit = new WorkspaceEdit();
                edit.set(document.uri, edits);

                var success = await workspace.applyEdit(edit);
                assert.deepEqual(document.getText(), original.toString());
                assert.equal(success, true);

            }
            catch (err) {
                assert.ok(false, `error in OpenTextDocument ${err}`);
            }
        });
    });
});