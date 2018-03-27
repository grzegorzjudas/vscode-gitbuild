import * as opn from 'opn';

import { window, QuickPickItem } from 'vscode';
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

interface GithubBuildListItem extends QuickPickItem {
    url: string
}

export default class PluginBuildList {
    private items: GithubBuildListItem[] = [];

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
        if (this.items.length === 0) return;

        window.showQuickPick(this.items).then((item) => {
            if (item && item.url) opn(item.url);
        });
    }
}
