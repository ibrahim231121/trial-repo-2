export namespace SearchModel {
    export type Evidence = {
        id: number;
        tenantId: number;
        masterAssetRecId: number;
        holdUntil?: Date;
        station: string;
        cADId: string;
        retentionPolicyName: string;
        devices: string;
        categories: string[];
        categorizedBy? : number;
        formData: FormDataKeyValue[];
        masterAsset: Asset;
        asset: Asset[];
        assetEventGeoData: AssetEventGeoData[];
        securityDescriptors: SecurityDescriptor[];
        expireOn: Date;
        description: string;
        retentionSpanText: string;
        onlyforlinkedasset?:string;
        relatedAssets : RelatedAssets[] | null;
        evidenceRelations : EvidenceRelations[];
    };

    export type FormDataKeyValue = {
        key: string;
        value: string;
    };

    export type Asset = {
        assetId: number;
        assetName: string;
        unit: string;
        status: string;
        state: string;
        assetType: string;
        isRestrictedView: boolean;
        thumbnailUri: string;
        recordedBy: string[];
        camera: string;
        audioDevice: string;
        recordingStarted: string;
        recordingEnded: string;
        preBuffer: number;
        postBuffer: number;
        duration: number;
        size: number;
        isOverlaid: boolean;
        segmentCount: number;
        owners: string[];
        lock: Lock;
        files: File[];
    };

    export type Lock = {
        groupRecId?: (number | null)[];
    };

    export type File = {
        filesId: number;
        type: string;
        accessCode?:string;
        fileName?: string;
    };

    export type AssetEventGeoData = {
        event: Event;
        lat: number;
        lon: number;
        altitude: number;
        altitudeAccuracy: number;
        errorCode: number;
        logTime: string;
        speed: number;
        speedAccuracy: number;
        timeZoneOffset: number;
    };

    export type Event = {
        name: string;
        id: number;
    };

    export type SecurityDescriptor = {
        groupId: number;
        permission: string;
    };

    export type RelatedAssets = {
        asset: Asset;
        evidenceId : number;
        relationType : string;
        rankScore : number;
    }

    export type EvidenceRelations = {
        valueRecId : number;
        valueDisplayName : string;
        evidenceId : number;
        assetId : number;
    };
}
