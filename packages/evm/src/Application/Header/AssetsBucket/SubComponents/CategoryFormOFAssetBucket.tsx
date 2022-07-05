import { TextField, CRXHeading } from "@cb/shared";
import { useTranslation } from "react-i18next";
interface Props {
    categoryObject: any
    setFieldForm : any
}

const CategoryFormOFAssetBucket: React.FC<Props> = ({ categoryObject,setFieldForm }) => {
    const { t } = useTranslation<string>();
    return (
        <>
            {categoryObject.form.map((formObj: any) => (
                    <div>
                        <CRXHeading variant="h4">
                            {t("Category")} {categoryObject.label}
                        </CRXHeading>
                        <CRXHeading variant="h6">
                             {t("Form")} {formObj.name}
                        </CRXHeading>
                        {formObj.fields.map((field: any) => (
                            <div>
                                <label className="categoryFormLabel" htmlFor={field.id}>{field.display.caption}</label>
                                <TextField type="text" id={field.id} name={field.name === undefined ? field.value : field.name} onChange={(e: any,formField: any) => {setFieldForm(e,field.formId,field.datatype)}} />
                            </div>
                        ))}
                    </div>
                ))}
        </>
    );
}

export default CategoryFormOFAssetBucket;