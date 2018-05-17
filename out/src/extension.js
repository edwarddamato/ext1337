'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let previewUri = vscode.Uri.parse('git-shpreview://authority/git-shpreview');
    const docProvider = new TextDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('git-shpreview', docProvider);
    vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            docProvider.update(previewUri);
        }
    });
    let disposable = vscode.commands.registerCommand('extension.showGitPreview', () => {
        // vscode.workspace.openTextDocument(previewUri)
        //     .then(doc => vscode.window.showTextDocument(doc));
        vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two, 'Git Preview').then((success) => {
            console.log('wow!!!');
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });
    context.subscriptions.push(disposable, registration);
}
exports.activate = activate;
class TextDocumentContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri) {
        const document = vscode.window.activeTextEditor.document;
        return this.snippet(document, 0, document.getText().length);
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
    snippet(document, propStart, propEnd) {
        const properties = document.getText().slice(propStart + 1, propEnd);
        return `<body>
                <div>${properties}</div>
            </body>`;
    }
}
//# sourceMappingURL=extension.js.map