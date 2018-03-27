import * as fs from 'fs';
import * as path from 'path';
import { window, StatusBarItem, StatusBarAlignment } from 'vscode';

import { BuildStatus } from './GitBuild';

export const statusToIcon = (status: BuildStatus) : string => {
    let icon = null;

    switch (status) {
        case BuildStatus.PENDING: { icon = 'ellipsis'; break; }
        case BuildStatus.SUCCESS: { icon = 'check'; break; }
        case BuildStatus.FAILURE: { icon = 'x'; break; }
        case BuildStatus.UNKNOWN: { icon = 'dash'; break; }
        default: { icon = 'dash'; }
    }

    return icon;
};

export default class PluginStatus {
    private element: StatusBarItem;
    public status: BuildStatus;

    constructor () {
        this.element = window.createStatusBarItem(StatusBarAlignment.Left);
        this.element.command = "githubbuild.listBuilds";
    
        this.update(BuildStatus.UNKNOWN);
        this.show();
    }

    public update(status: BuildStatus) {
        const icon = statusToIcon(status);

        if (icon) {
            this.element.text = `Build: $(${icon})`;
            this.status = status;
        }
    }

    public show () {
        this.element.show();
    }

    public hide () {
        this.element.hide();
    }

    public setHint (hint: string) {
        this.element.tooltip = hint;
    }
}
