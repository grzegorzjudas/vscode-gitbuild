import * as fetch from 'node-fetch';
import * as URL from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { workspace, WorkspaceFolder } from 'vscode';

import Credentials from './Credentials';
import { BuildStatus } from './PluginStatus';

interface GithubStatusRequestOptions {
    url: string;
    org: string;
    repo: string;
}

export default class Git {
    private root: string;
    private url: string;
    private auth: Credentials;
    private org: string;
    private repo: string;
    private branch: string;
    private commit: string;
    public onBranchChange: Function;
    public onCommitChange: Function;

    constructor (root: string) {
        this.root = URL.parse(root).href;

        const [ url, org, repo ] = this.getConfigFromFile();

        this.url = 'https://' + URL.parse(url).href;
        this.org = org;
        this.repo = repo;
        this.commit = Git.getCurrentCommit();
        this.branch = Git.getCurrentBranch();

        this.onBranchChange = () => {};
        this.onCommitChange = () => {};

        let commitWatcher;

        const commitChangeCallback = () => {
            const commit = Git.getCurrentCommit();

            if (this.commit !== commit) {
                this.commit = commit;
                this.onCommitChange(commit);
            }
        };

        const branchChangeCallback = () => {
            const branch = Git.getCurrentBranch();

            this.branch = branch
            this.onBranchChange(branch);

            commitChangeCallback();

            fs.watch(path.join(this.root, 'refs', 'heads', Git.getCurrentBranch()), commitChangeCallback);
            fs.watch(path.join(this.root, 'HEAD'), branchChangeCallback);
        };

        fs.watch(path.join(this.root, 'refs', 'heads', Git.getCurrentBranch()), commitChangeCallback);
        fs.watch(path.join(this.root, 'HEAD'), branchChangeCallback);
    }

    public setCredentials (auth: Credentials) {
        this.auth = auth;
    }

    public async getBuildStatus () : Promise<BuildStatus> {
        const url = `${this.url}/api/v3/repos/${this.org}/${this.repo}/commits/${this.commit}/status`;
        const authHeader = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64');

        return fetch(url, {
            headers: {
                Authorization: `Basic ${authHeader}`
            }
        }).then((res) => {
            if (res.status >= 400) throw new Error(`Got '${res.statusText}' when requesting '${url}'`);

            return res;
        }).then((res) => {
            return res.json();
        }).then((res) => {
            switch (res.state) {
                case 'pending': return BuildStatus.PENDING;
                case 'success': return BuildStatus.SUCCESS;
                case 'failure': return BuildStatus.FAILURE;
                default: return BuildStatus.UNKNOWN;
            }
        });
    }

    public static findRootGithubDir () : string {
        const workspaces = workspace.workspaceFolders;
        let gitFolderPath = '';

        for (const wspace of workspaces) {
            let currentPath = wspace.uri.fsPath;

            for (let dirs = currentPath.split('/').length - 1; dirs > 0; --dirs) {
                const fullCurrentPath = path.join(currentPath, '.git');
                const exists = fs.existsSync(fullCurrentPath);

                if (exists) {
                    gitFolderPath = path.join(currentPath, '.git');
                    break;
                }

                currentPath = currentPath.split('/').slice(0, -1).join('/');
            }
        }

        return gitFolderPath;
    }

    public static getCurrentBranch () : string {
        const gitDir = Git.findRootGithubDir();

        if (gitDir) {
            const ref = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf-8');
            const currentBranch = ref.replace('ref: refs/heads/', '').replace(/(\r\n\t|\n|\r\t)/gm, '');

            return currentBranch;
        }
    }

    public static getCurrentCommit () : string {
        const gitDir = Git.findRootGithubDir();

        if (gitDir) {
            const currentBranch = Git.getCurrentBranch();
            const currentCommit = fs.readFileSync(path.join(gitDir, 'refs', 'heads', currentBranch), 'utf-8');

            return currentCommit.replace(/(\r\n\t|\n|\r\t)/gm, '');
        }
    }

    private getConfigFromFile() : string[] {
        const url = fs.readFileSync(path.join(this.root, 'config'), 'utf8');
        const line = url.match(/url = git@([a-z0-9\-.]+):([a-z0-9\-]+)\/([a-z0-9\-]+)/);

        return line.slice(1);
    }
}
