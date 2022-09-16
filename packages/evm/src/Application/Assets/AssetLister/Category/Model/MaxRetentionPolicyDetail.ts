type Nullable<T> = T | null;
export interface MaxRetentionPolicyDetail{
    maxRetentionId : Nullable<number>;
    maxRetenionHours : Nullable<number>;
    maxRetenionGraceHours : Nullable<number>;
}