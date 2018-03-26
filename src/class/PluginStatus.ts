import * as fs from 'fs';
import * as path from 'path';

import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { settings } from 'cluster';

export enum BuildStatus { PENDING, FAILURE, SUCCESS, UNKNOWN }

export default class PluginStatus {
    private element: StatusBarItem;
    public status: BuildStatus;

    constructor () {
        this.element = window.createStatusBarItem(StatusBarAlignment.Left);
    
        this.update(BuildStatus.UNKNOWN);
        this.show();
    }

    public update(status: BuildStatus) {
        let icon = null;

        switch (status) {
            case BuildStatus.PENDING: { icon = 'ellipsis'; break; }
            case BuildStatus.SUCCESS: { icon = 'check'; break; }
            case BuildStatus.FAILURE: { icon = 'x'; break; }
            case BuildStatus.UNKNOWN: { icon = 'dash'; break; }
            default: { icon = 'dash'; }
        }

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
}
