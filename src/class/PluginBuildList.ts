import * as opn from 'opn';

import { window, QuickPickItem, QuickPickOptions } from 'vscode';
import { GitBuild, stringToBuildStatus } from './GitBuild';

import { statusToIcon } from './PluginStatus';

const formatDate = (date: Date) => {
    const hour = withLeadingZero(date.getHours());
    const minutes = withLeadingZero(date.getMinutes());
    const seconds = withLeadingZero(date.getSeconds());

    const day = withLeadingZero(date.getDate());
    const month = withLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${hour}:${minutes}:${seconds} ${day}-${month}-${year}`;
};

const withLeadingZero = (number) => {
    if (number >= 0 && number < 10) return `0${number}`;
    else return `${number}`;
}

export interface GithubBuildListItem extends QuickPickItem {
    url: string
}

export default class PluginBuildList {
    private items: GithubBuildListItem[] = [];
    private options: QuickPickOptions;

    constructor () {
        this.options = <QuickPickOptions> {
            onDidSelectItem: (item: GithubBuildListItem) => {
                console.log(item.url);
            }
        };
    }

    public setList (items: GitBuild[]) {
        this.items = items.map((item) => {
            return {
                label: `$(${statusToIcon(item.state)}) ${item.context}`,
                detail: item.description,
                description: formatDate(new Date(item.updated_at)),
                url: item.target_url
            };
        });
    }

    public show () {
        window.showQuickPick(this.items, this.options);
    }
}
