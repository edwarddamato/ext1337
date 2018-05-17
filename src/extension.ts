'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let previewUri = vscode.Uri.parse('git-shpreview://authority/git-shpreview');

    const docProvider = new TextDocumentContentProvider();
    const registration = vscode.workspace.registerTextDocumentContentProvider('git-shpreview', docProvider);

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		if (e.document === vscode.window.activeTextEditor.document) {
			docProvider.update(previewUri);
		}
	});

    let disposable = vscode.commands.registerCommand('extension.showGitPreview', () => {
        // vscode.workspace.openTextDocument(previewUri)
        //     .then(doc => vscode.window.showTextDocument(doc));

        vscode.commands.executeCommand('vscode.previewHtml',
            previewUri,
            vscode.ViewColumn.Two,
            'Git Preview').then((success) => {
                console.log('wow!!!');
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	});

    context.subscriptions.push(disposable, registration);
}

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    
    public provideTextDocumentContent(uri: vscode.Uri): string {
        const document = vscode.window.activeTextEditor.document;
        return this.snippet(document, 0, document.getText().length);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private snippet(document: vscode.TextDocument, propStart: number, propEnd: number): string {
        const properties = document.getText().slice(propStart + 1, propEnd);
        return `<body>
                <div>${properties}</div>
            </body>`;
    }
}
