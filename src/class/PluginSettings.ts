import * as fs from 'fs';
import * as URL from 'url';
import * as path from 'path';

import { window, WorkspaceFolder } from 'vscode';

export interface PluginSettingsModel {
    url: string,
    username: string,
    password: string
}

export default class PluginSettings {
    private path: string;
    private encoding: string;
    public settings: PluginSettingsModel;
    public onUpdate: Function;
    public onDelete: Function;
    public onCreate: Function;
    public onError: Function;
    public onLoaded: Promise<PluginSettingsModel>;

    constructor (path: string, encoding: string = 'utf-8') {
        this.path = path;
        this.encoding = encoding;

        this.onUpdate = () => {};
        this.onDelete = () => {};
        this.onCreate = () => {};
        this.onError = () => {};

        fs.watch(path, encoding, this.handleEvent.bind(this));

        let resolver;

        this.onLoaded = new Promise((resolve) => {
            resolver = resolve;
        });

        (async () => {
            this.settings = await this.read();
            resolver(this.settings);
        })();
    }

    public get(key: string) {
        return this.settings[key];
    }

    public static findConfigInWorkspaces (workspaces: WorkspaceFolder[]) : string {
        let settingsFilePath = '';

        for (const wspace of workspaces) {
            const filePath = path.join(wspace.uri.fsPath, '.vsgitbuild');
            const exists = fs.existsSync(filePath);

            if (exists) settingsFilePath = filePath;
        }

        return settingsFilePath;
    }

    private async handleEvent (eventType: string, fileName: string) {
        const exists = fs.existsSync(this.path);

        if (!exists) {
            this.onDelete();
            
            return;
        }

        if (eventType === 'change') {
            let settings;

            try {
                settings = await this.read();
            } catch (err) {
                this.onError(err);
                return;
            }
            
            const old = this.settings;
            this.settings = settings;
            this.onUpdate(settings, old);
        }
    }
    
    private async read () : Promise<PluginSettingsModel> {
        return new Promise<PluginSettingsModel>((resolve, reject) => {
            fs.readFile(this.path, this.encoding, (err, data) => {
                let settings: PluginSettingsModel;
                
                try {
                    settings = JSON.parse(data);
                } catch (err) {
                    reject(err);
                }

                resolve(settings);
            });
        });
    }
}
