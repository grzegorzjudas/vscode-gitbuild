export interface GitBuild {
    url: string;
    id: number;
    state: BuildStatus;
    description: string;
    target_url: string;
    context: string;
    created_at: Date;
    updated_at: Date;
}

export enum BuildStatus { PENDING, FAILURE, SUCCESS, UNKNOWN }

export function stringToBuildStatus (status: string) {
    switch (status) {
        case 'pending': return BuildStatus.PENDING;
        case 'failure': return BuildStatus.FAILURE;
        case 'success': return BuildStatus.SUCCESS;
        default: return BuildStatus.UNKNOWN;
    }
}
