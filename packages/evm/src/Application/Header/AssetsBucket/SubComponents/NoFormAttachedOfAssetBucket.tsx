import { Alert } from '@material-ui/lab';
import { CRXHeading, CRXButton, CRXAlert } from '@cb/shared';
interface Props {
    categoryCollection: any;
}

const NoFormAttachedOfAssetBucket: React.FC<Props> = ({ categoryCollection }) => {
    const alertIcon = <i className='fas fa-info-circle attentionIcon'></i>;
    const rowLen: number = categoryCollection?.length;

    return (
        <>
            <CRXHeading variant='h6' className='categoryNextTitle dailogFormHeading'>
                Category Title Placeholder Here
                {categoryCollection.map((field: any, _key: number) => (
                    <span key={_key}>
                        <b> {field.name}</b>
                        {rowLen !== _key + 1 && <span>,</span>}
                    </span>
                ))}
            </CRXHeading>
            <Alert className='attentionAlert' severity='info' icon={alertIcon}>
                <b>Attention:</b> There is no form response for the category named,{' '}
                {categoryCollection.map((field: any, _key: any) => (
                    <span key={_key}>
                        <span className='cateName' key={_key}>
                            '{field.name}'
                        </span>
                        {rowLen !== _key + 1 && <span>,</span>}
                    </span>
                ))}
                . Please save to continue.{' '}
            </Alert>
        </>
    );
}

export default NoFormAttachedOfAssetBucket;