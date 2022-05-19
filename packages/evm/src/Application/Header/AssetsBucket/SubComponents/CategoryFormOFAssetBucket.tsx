import { TextField, CRXHeading } from "@cb/shared";
interface Props {
    categoryObject: any
}

const CategoryFormOFAssetBucket: React.FC<Props> = ({ categoryObject }) => {
    return (
        <>
            {categoryObject.form.map((formObj: any) => (
                    <div>
                        <CRXHeading variant="h4">
                            Category {categoryObject.label}
                        </CRXHeading>
                        <CRXHeading variant="h6">
                             Form {formObj.name}
                        </CRXHeading>
                        {formObj.fields.map((field: any) => (
                            <div>
                                <label className="categoryFormLabel" htmlFor={field.id}>{field.display.caption}</label>
                                <TextField type="text" id={field.id} name={field.name === undefined ? field.value : field.name} onChange={() => { }} />
                            </div>
                        ))}
                    </div>
                ))}
        </>
    );
}

export default CategoryFormOFAssetBucket;