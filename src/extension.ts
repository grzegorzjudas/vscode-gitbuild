import { workspace, ExtensionContext } from 'vscode';
import Plugin from './class/Plugin';

export function activate (context: ExtensionContext) {
    const plugin = new Plugin(context);
}
