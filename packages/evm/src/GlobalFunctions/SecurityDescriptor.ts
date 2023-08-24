import { PersmissionModel, securityDescriptorType } from "../utils/Api/models/EvidenceModels";

export const findMaximumDescriptorId = (
    securityDescriptors: Array<securityDescriptorType>
): number => {
    return securityDescriptors?.length === 0
        ? 0
        : Math.max.apply(
            Math,
            securityDescriptors.map((o) => {
                return parseInt(PersmissionModel[o.permission], 10);
            })
        );
};