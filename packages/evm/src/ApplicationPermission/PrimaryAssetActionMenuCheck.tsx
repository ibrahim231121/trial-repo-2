import React from 'react';

type Props = {
    asset: any,
    evidence: any,
    actionMenuName: string,
};

const notAllowedPrimaryActionMenu = ["Set as primary", "Move asset"]

const PrimaryAssetActionMenuCheck: React.FunctionComponent<Props> = ({ evidence, actionMenuName, asset, children }) => {
    if (notAllowedPrimaryActionMenu.indexOf(actionMenuName) !== -1 && asset?.assetId?.toString() === evidence?.masterAssetId.toString()) {
        return null;
    }
    return <>{children}</>;
};

export default PrimaryAssetActionMenuCheck;