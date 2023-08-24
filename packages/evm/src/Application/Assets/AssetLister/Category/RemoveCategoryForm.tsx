import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CRXButton, CRXHeading } from '@cb/shared';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { FormValues, RemoveCategoryFormProps, RetentionDetailForCalculation } from './Model/RemoveCategoryFormModel';
import { ExtractHoursFromCMTEntityRecord, RetentionDateTimeFormatter } from '../../../../GlobalFunctions/AssetRetentionFormat';
import { SetupConfigurationAgent, UnitsAndDevicesAgent } from '../../../../utils/Api/ApiAgent';
import { StationPolicy } from '../../../../utils/Api/models/StationModels';
import { CategoryRemovalType } from './Model/CategoryFormContainerModel';
import { setLoaderValue } from '../../../../Redux/loaderSlice';
import { CalculateCategoryRetentionDetail } from './Utility/UtilityFunctions';

const RemoveCategoryForm: React.FC<RemoveCategoryFormProps> = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation<string>();
  const [stationPolicies, setStationPolicies] = React.useState<StationPolicy[]>([]);
  const categoryOptions = useSelector((state: any) => state.assetCategory.category);
  const stations = useSelector((state: any) => state.stationReducer.stationInfo);
  const initialValues: FormValues = {
    reason: ''
  };
  const [retentionDetail, setRetentionDetail] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    props.setModalTitle(t('Removing_the_category_requires_a_reason'));
    props.setremoveClassName('crx-remove-category-form');
    props.setIndicateTxt(false);
    //NOTE : MultiSelect case.
    if (!props.evidence && props.selectedItems.length > 1) {
      const stationPromises: Array<Promise<StationPolicy[]>> = [];
      let stationDetails: Array<{ stationId: number, stationName: string, evidenceId: number, hours: number }> = [];
      for (const asset of props.selectedItems) {
        const station = stations.find((station: any) => station.name === asset.evidence.station);
        if (station) {
          const _stationId = parseInt(station.id);
          stationDetails.push({
            evidenceId: asset.evidence.id,
            stationId: _stationId,
            stationName: station.name,
            hours: 0
          });
          stationPromises.push(UnitsAndDeviceAgentPromise(_stationId));
        }
      }
      if (stationPromises.length > 0) {
        Promise.all(stationPromises).then((response) => {
          const policies = response.flat();
          let iterator = 0;
          for (const detail of stationDetails) {
            detail.hours = ExtractHoursFromCMTEntityRecord(policies[iterator].retentionPolicyId).totalHours;
          }
          const EffectedAssets = [];
          const messageArr = [];
          stationDetails = stationDetails.sort((a: any, b: any) => (a.hours > b.hours ? 1 : -1)).reverse();
          for (const selectedAsset of props.selectedItems) {
            const expiryDate = moment(selectedAsset.evidence.holdUntil ?? selectedAsset.evidence.expireOn);
            const newExpiryDate = moment().add('hours', stationDetails[0].hours);
            const assetName = selectedAsset.evidence.asset.find((x: any) => x.assetId == selectedAsset.assetId).assetName;
            if (!newExpiryDate.isAfter(expiryDate)) {
              //Show messaage, cause Retention will get effected,
              EffectedAssets.push({
                assetName: assetName,
                difference: RetentionDateTimeFormatter(moment(), newExpiryDate)
              });
            }
          }
          if (EffectedAssets.length > 0) {
            for (const eff of EffectedAssets) {
              const message = `${eff.assetName} will Expire in ${eff.difference}`
              messageArr.push(message + '\n');
            }
            props.setDifferenceOfRetentionTime(`${t("Please_be_aware_that_by_modifying_the_categories_you_are_reducing_the_assets_lifetime")} ${'\n'} ${messageArr.join()}`);
            props.setRemovalType(CategoryRemovalType.HighestRetentionCategoryRemovalInMultiSelect);
          }
        });
      }
      // Get Category Retentions on page start up.
      if (props.selectedItems[0].evidence.categories.length > 0) { //Getting first index, cause at this stage, every asset have same category.
        const selectedAssetCategories = categoryOptions.filter((o: any) => props.selectedItems[0].evidence.categories.some((i: string) => i === o.name));
        const retentionList = CalculateCategoryRetentionDetail(selectedAssetCategories).retentionList;
        SetupConfigurationAgent.getRetentionPolicyObjectFromRetentionIds(retentionList)
        .then((dataRetentionPromisesResponse) => setRetentionDetail(dataRetentionPromisesResponse as Array<any>));
      }
    }
    //NOTE : Normal case.
    if ((props.evidence) && (props.selectedItems.length <= 1)) {
      const stationId = props.evidence.stationId.cmtFieldValue;
      UnitsAndDevicesAgentApiCall(stationId);
    }
  }, []);

  const cancelBtn = () => {
    let newValue = categoryOptions
      .filter((o: any) => o.id === props.removedOption.id)
      .map((i: any) => {
        return {
          id: i.id,
          label: i.name
        };
      })[0];
    if (newValue) {
      props.setSelectedCategoryValues((prevState) => [...prevState, newValue]); // Set removed option in to State again.
      props.setRemovedOption({});
    }
    props.setActiveForm(0);
  }

  const UnitsAndDevicesAgentApiCall = (stationId: number) => {
    dispatch(setLoaderValue({ isLoading: true }));
    UnitsAndDeviceAgentPromise(stationId).then((response) => {
      setStationPolicies(response);
      dispatch(setLoaderValue({ isLoading: false }));
    }).catch((err: any) => {
      dispatch(setLoaderValue({ isLoading: false, error: true }));
      console.error(err);
    });
  }

  const UnitsAndDeviceAgentPromise = (stationId: number): Promise<StationPolicy[]> => UnitsAndDevicesAgent.getStationPolicies(stationId);

  const getPolicyAsync = () => {
    const retentionDetails: RetentionDetailForCalculation[] = [];
    const removedCategory = props.removedOption;
    if (props.evidence) {
      const categoryObject = props.evidence.categories;
      for (const elem of categoryObject) {
        if (elem.dataRetentionPolicy) {
          const cmtExtractValues = ExtractHoursFromCMTEntityRecord(elem.dataRetentionPolicy);
          retentionDetails.push({
            categoryName: elem.record?.record.filter((x) => x.key === 'Name')[0].value ?? "",
            retentionId: cmtExtractValues.retentionId,
            hours: cmtExtractValues.totalHours
          });
        }
      }
    } else {
      //Multi Asset Selection Case.
      const categoryObject = categoryOptions.filter((o: any) => props.selectedItems[0].evidence.categories.some((i: string) => i === o.name));
      for (const category of categoryObject) {
        const retentionId = category.policies.retentionPolicyId;
        const retentionTime = retentionDetail.find((x : any) => x.id == retentionId).detail.limit;
        retentionDetails.push({
          categoryName: category.name,
          retentionId: retentionId,
          hours: retentionTime.hours + retentionTime.gracePeriodInHours
        });
      }
    }
    /** 
     * * Sorted Array in Descending order by Hours. 
     * */
    const sortedArray = retentionDetails.sort((a, b) => (a.hours > b.hours ? 1 : -1)).reverse();
    const highestRetention = sortedArray[0];
    if (sortedArray.length == 1) {
      /** 
       * * This was the last category 
       * */
      if (stationPolicies[0].retentionPolicyId) {
        const cmtExtractValues = ExtractHoursFromCMTEntityRecord(stationPolicies[0].retentionPolicyId);
        const totalHours = cmtExtractValues.totalHours;
        const newExpiryDate = moment().add(totalHours, 'hours');
        const differenceOfRetentionTime = RetentionDateTimeFormatter(moment(), newExpiryDate);
        props.setDifferenceOfRetentionTime(differenceOfRetentionTime);
        props.setRemovalType(CategoryRemovalType.LastCategoryRemoval);
        props.setActiveForm(4);
        return;
      }
    }
    const SecondHighestRetention = sortedArray[1];
    if (highestRetention.categoryName === removedCategory.label) {
      /** 
       * * Selected Category have Highest Hours 
       * */
      const newExpiryDate = moment().add(SecondHighestRetention.hours, 'hours');
      const differenceOfRetentionTime = RetentionDateTimeFormatter(moment(), newExpiryDate);
      props.setHoldUntill(newExpiryDate.format('YYYY-MM-DDTHH:mm:ss'));
      props.setDifferenceOfRetentionTime(differenceOfRetentionTime);
      props.setRemovalType(CategoryRemovalType.HighestRetentionCategoryRemoval);
      props.setActiveForm(4);
    }
    else {
      /** 
       * * Normal Removal 
       * */
      props.setRemovalType(CategoryRemovalType.NotEffectingRetentionRemoval);
      props.setActiveForm(4);
    }
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={({ reason }: any, actions) => {
          // If assest is going to uncategorized.
          const categoriesLenght: number = props.selectedCategoryValues?.length;
          props.setRemoveMessage(reason);
          if (categoriesLenght == 0)
            props.setActiveForm(4);
          getPolicyAsync();
          actions.setSubmitting(false);
        }}
        validationSchema={Yup.object({
          reason: Yup.string().required(t("Required"))
        })}>
        {({ handleChange, isValid, dirty }) => (
          <Form>
            <div className="indicatestext indicateLessPadding"><b>*</b> {t('Indicates_required_field')}</div>
            <CRXHeading className='categoryDescription removeCategoryDescription' variant='h6'>
              {t('Please_enter_the_reason_for_removing_the_category.')}
            </CRXHeading>
            <div className='CRXCategory'>
              {t('Category_removal_reason')} <b className='formStaric'>*</b>
            </div>
            <Field
              id='reaon'
              className='crx-category-scroll'
              name='reason'
              as='textarea'
              onChange={(event: any) => {
                handleChange(event);
                props.setIsformUpdated(true)
              }}
            />
            <ErrorMessage name='reason' render={(msg) => <div style={{ color: 'red' }}>{msg}</div>} />
            <div className='modalFooter CRXFooter removeFooter'>
              <div className='nextBtn'>
                <CRXButton className='primeryBtn' type='submit' disabled={!(isValid && dirty)}>
                  {t("Save")}
                </CRXButton>
              </div>
              <div className='cancelBtn'>
                <CRXButton onClick={cancelBtn} className='cancelButton'>
                  {t("Cancel")}
                </CRXButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RemoveCategoryForm;