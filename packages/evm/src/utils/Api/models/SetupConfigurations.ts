export namespace SetupConfigurationsModel {
    export interface GlobalAssetViewReason {
        recId: number;
        label: string;
        inputValue: string;
        isRequired: string;
    }

    export interface Policies {
        retentionPolicyId: number;
        uploadPolicyId: number;
    }

    export interface Display {
        caption: string;
        width: number;
        order: number;
    }

    export interface History {
        createdOn: Date;
        modifiedOn?: any;
        version: string;
    }

    export interface Field {
        id: string;
        name: string;
        type: string;
        dependentField: number;
        defaultFieldValue: string;
        display: Display;
        history: History;
    }

    export interface Form {
        id: string;
        name: string;
        description: string;
        type: string;
        fields: Field[];
        history: History;
    }

    export interface Category {
        id: number;
        name: string;
        description: string;
        policies: Policies;
        forms: Form[];
        history: History | null;
    }
}
