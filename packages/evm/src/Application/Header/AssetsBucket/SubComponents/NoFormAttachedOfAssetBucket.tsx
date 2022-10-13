import { Alert } from '@material-ui/lab';
import { CRXHeading, CRXButton, CRXAlert } from '@cb/shared';
import { useTranslation } from "react-i18next";
interface Props {
    categoryCollection: any;
}

const NoFormAttachedOfAssetBucket: React.FC<Props> = ({ categoryCollection }) => {
    const { t } = useTranslation<string>();
    const alertIcon = <i className='fas fa-info-circle attentionIcon'></i>;
    const rowLen: number = categoryCollection?.length;

    return (
        <>
        {console.log('categoryCollection', categoryCollection)}
            <CRXHeading variant='h6' className='categoryNextTitle dailogFormHeading'>
                {t("Category_Title_Placeholder_Here")}
                {categoryCollection.map((field: any, _key: number) => (
                    <span key={_key}>
                        <b> {field.label}</b>
                        {rowLen !== _key + 1 && <span>,</span>}
                    </span>
                ))}
            </CRXHeading>
            <Alert className='attentionAlert' severity='info' icon={alertIcon}>
                <b>{t("Attention")}:</b> {t("There_is_no_form_response_for_the_category_named")},{' '}
                {categoryCollection.map((field: any, _key: any) => (
                    <span key={_key}>
                        <span className='cateName' key={_key}>
                            '{field.label}'
                        </span>
                        {rowLen !== _key + 1 && <span>,</span>}
                    </span>
                ))}
                . {t("Please_save_to_continue")}.{' '}
            </Alert>
        </>
    );
}

export default NoFormAttachedOfAssetBucket;
