import React from 'react';
import { Formik, ErrorMessage, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CRXHeading, TextField } from '@cb/shared';

type DisplayCategoryFormProps = {
  isCategoryEmpty: boolean;
  categoryObject: any;
  initialValuesObjects: Array<any>;
  setFieldsFunction: (param: any) => void;
};

const DisplayCategoryForm: React.FC<DisplayCategoryFormProps> = (props) => {
  const initialValuesArray = [];
  for (const i in props.initialValuesObjects) {
    initialValuesArray.push(i);
  }

  const formSchema = initialValuesArray.reduce(
    (obj, item) => ({ ...obj, [item]: Yup.string().required('Required') }),
    {}
  );

  return (
    <>
      {props.categoryObject.form.map((formObj: any, key: number) => (
        <div className='categoryFormAdded' key={key}>
          <CRXHeading variant='h4' className='categoryFormTitle'>
            Category Forms{' '}
            {formObj.record !== undefined
              ? formObj.record.record.find((x: any) => x.key === 'Name').value
              : formObj.name}
          </CRXHeading>
          <Formik
            enableReinitialize={true}
            initialValues={props.initialValuesObjects}
            onSubmit={() => {}}
            validationSchema={Yup.object({
              ...formSchema
            })}>
            <Form>
              {formObj.fields.map((field: any, fieldKey: any) => (
                <div className='categoryInnerField' key={fieldKey}>
                  <label className='categoryFormLabel' htmlFor={field.id}>
                    {field.key === undefined ? field.name : field.key}
                  </label>
                  <b className='formStaric'>*</b>
                  <div className='CBX-input'>
                  <Field
                    className='editCategoryField'
                    id={field.id}
                    name={field.value === undefined ? field.name : field.value}
                    onKeyUp={(e: any) => {
                      props.setFieldsFunction(e);
                    }}
                  />
                  </div>
                  <ErrorMessage
                    name={field.value === undefined ? field.name : field.value}
                    render={(msg) => <div className='errorStyle'>{msg}</div>}
                  />
                </div>
              ))}
            </Form>
          </Formik>
        </div>
      ))}
    </>
  );
};

export default DisplayCategoryForm;
