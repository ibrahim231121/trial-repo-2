export module AssetCategory {
    export interface RecordObject {
        key: string;
        value: string;
    }

    export interface Record {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: RecordObject[];
    }

    export interface Field {
        id: string;
        key: string;
        value: string;
        dataType: string;
        version: string;
        createdOn: Date;
        modifiedOn?: Date;
    }

    export interface FormData {
        formId: string;
        record: Record;
        fields: Field[];
    }

    export interface Record3 {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: RecordObject[];
    }

    export interface DataRetentionPolicy {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: RecordObject[];
    }

    export interface Category {
        id: string;
        formData: FormData[];
        assignedOn: Date;
        record: Record3;
        dataRetentionPolicy: DataRetentionPolicy;
        name: string;
    }

    export interface Unit {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: any[];
    }

    export interface Recording {
        started: Date;
        ended: Date;
    }

    export interface Buffering {
        pre: number;
        post: number;
    }

    export interface Recording2 {
        started: Date;
        ended: Date;
    }

    export interface Checksum {
        checksum: string;
        status: boolean;
        algorithm: string;
    }

    export interface File {
        id: string;
        assetId: string;
        name: string;
        type: string;
        extension: string;
        url: string;
        size: number;
        duration: number;
        recording: Recording2;
        sequence: number;
        checksum: Checksum;
        version: string;
        createdOn: Date;
        modifiedOn?: any;
    }

    export interface Lock {
        roles: any[];
    }

    export interface Master {
        id: string;
        name: string;
        typeOfAsset: string;
        status: string;
        state: string;
        unitId: number;
        unit: Unit;
        isRestrictedView: boolean;
        duration: number;
        recording: Recording;
        buffering: Buffering;
        audioDevice: string;
        camera: string;
        isOverlaid: boolean;
        recordedByCSV: string;
        bookMarks: any[];
        notes: any[];
        files: File[];
        owners: any[];
        lock: Lock;
        version: string;
        createdOn: Date;
        modifiedOn?: any;
    }

    export interface Checksum2 {
        checksum: string;
        status: boolean;
        algorithm: string;
    }

    export interface File2 {
        id: string;
        assetId: string;
        name: string;
        type: string;
        extension: string;
        url: string;
        size: number;
        duration: number;
        recording?: any;
        sequence: number;
        checksum: Checksum2;
        version: string;
        createdOn: Date;
        modifiedOn?: any;
    }

    export interface Child {
        id: string;
        name: string;
        typeOfAsset: string;
        status: string;
        state: string;
        unitId: number;
        unit: Unit;
        isRestrictedView: boolean;
        duration: number;
        recording?: any;
        buffering?: any;
        audioDevice?: any;
        camera?: any;
        isOverlaid: boolean;
        recordedByCSV: string;
        bookMarks?: any;
        notes?: any;
        files: File2[];
        owners: any[];
        lock: Lock;
        version: string;
        createdOn: Date;
        modifiedOn?: any;
    }

    export interface Assets {
        master: Master;
        children: Child[];
    }

    export interface StationId {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: RecordObject[];
    }

    export interface RetentionPolicyId {
        id: string;
        cmtFieldName: string;
        cmtFieldValue: number;
        record: RecordObject[];
    }

    export interface RootObject {
        id: string;
        categories: Category[];
        assets: Assets;
        retainUntil: Date;
        stationId: StationId;
        retentionPolicyId: RetentionPolicyId;
        computerAidedDispatch: string;
        tag: string;
        version: string;
        createdOn: Date;
        modifiedOn: Date;
    }
}
