import { workspace, ExtensionContext } from 'vscode';
import GitBuildPlugin from './class/GitBuildPlugin';

export function activate (context: ExtensionContext) {
    const plugin = new GitBuildPlugin(context);
}
