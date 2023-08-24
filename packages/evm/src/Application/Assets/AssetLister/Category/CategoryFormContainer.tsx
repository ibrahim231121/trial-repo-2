import React, { useContext } from 'react';
import { CRXModalDialog } from '@cb/shared';
import CategoryDropdownForm from './CategoryDropdownForm';
import CategoryForm from './CategoryForm';
import RemoveCategoryForm from './RemoveCategoryForm';
import CancelConfirmForm from './Confirmation/CancelConfirmForm';
import RemoveCategoryConfirmForm from './Confirmation/RemoveCategoryConfirmForm';
import EditConfirmForm from './Confirmation/EditConfirmForm';
import { filterCategory } from './Utility/UtilityFunctions';
import { Evidence } from '../../../../utils/Api/models/EvidenceModels';
import { EvidenceAgent } from '../../../../utils/Api/ApiAgent';
import usePrevious from './Utility/usePrev';
import { CategoryRemovalType, CategoryFormContainerProps, SelectedCategoryModel } from './Model/CategoryFormContainerModel';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { setLoaderValue } from '../../../../Redux/loaderSlice';
import ApplicationPermissionContext from '../../../../ApplicationPermission/ApplicationPermissionContext';
import { CRXToaster } from '@cb/shared';

const CategoryFormContainer: React.FC<CategoryFormContainerProps> = React.memo((props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [showsSticky, setshowSSticky] = React.useState(false);
  const [activeForm, setActiveForm] = React.useState<number>(0);
  const [removedOption, setRemovedOption] = React.useState<any>({});
  const [differenceOfRetentionTime, setDifferenceOfRetentionTime] = React.useState<string>('');
  const [modalTitle, setModalTitle] = React.useState('');
  const [removeClassName, setremoveClassName] = React.useState('');
  const [IsformUpdated, setIsformUpdated] = React.useState(false);
  const [removalType, setRemovalType] = React.useState<CategoryRemovalType>(CategoryRemovalType.NotEffectingRetentionRemoval);
  const [removeMessage, setRemoveMessage] = React.useState<string>('');
  const [holdUntill, setHoldUntill] = React.useState<string>('');
  const [indicateTxt, setIndicateTxt] = React.useState<boolean>(true);
  const [evidenceResponse, setEvidenceResponse] = React.useState<Evidence>();
  const [previousValueState, setPreviousValueState] = React.useState(0);
  const [isMultiSelectAssetHaveSameCategory, setIsMultiSelectAssetHaveSameCategory] = React.useState(false);
  const [fixedOptions, setFixedOptions] = React.useState<Array<any>>([]);
  const [selectedCategoryValues, setSelectedCategoryValues] = React.useState<Array<SelectedCategoryModel>>([]);
  const prevActiveForm = usePrevious(activeForm);
  const setupCategories = useSelector((state: any) => state.assetCategory.category);
  const { getModuleIds } = useContext(ApplicationPermissionContext);
  const hasRemoveRights = getModuleIds().includes(4) ? true : false;
  const dispatch = useDispatch();
  const toasterRef = React.useRef<typeof CRXToaster>(null);

  React.useEffect(() => {
    if (previousValueState !== prevActiveForm)
      setPreviousValueState(prevActiveForm)
  }, [activeForm]);

  React.useEffect(() => {
    if (props.openForm) {
      if (props.evidenceId && props.selectedItems.length <= 1)
        evidenceApiCall(props.evidenceId);
      else
        setIsMultiSelectAssetHaveSameCategory(InMultiSelectCaseAssetsHaveSameCategories());
      setOpenModal(true);
      setActiveForm(0);
    }
  }, [props.openForm]);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    if (IsformUpdated) {
      setActiveForm(2);
      if (activeForm === 2)
        closeAndResetModal();
      return;
    }

    const newValue = []
      .filter((o: any) => o.id === removedOption.id)
      .map((i: any) => {
        return {
          id: i.id,
          label: i.name
        };
      })[0];
    if (newValue) {

      setSelectedCategoryValues((prevState: any) => [...prevState, newValue]); // Set removed option in to State again.
      setRemovedOption({});
    }
    closeAndResetModal();
  }

  const closeAndResetModal = () => {
    setOpenModal(false);
    setActiveForm(0);
    props.setOpenForm();
  }

  const evidenceApiCall = (evidenceId: number) => {
    dispatch(setLoaderValue({ isLoading: true }));
    EvidenceAgent.getEvidence(evidenceId).then((response: Evidence) => {
      const categoryOptions = filterCategory(response.categories);
      if(!hasRemoveRights)
        setFixedOptions(categoryOptions);
      setSelectedCategoryValues(categoryOptions);
      setEvidenceResponse(response);
      dispatch(setLoaderValue({ isLoading: false }));
    })
      .catch((err: any) => {
        dispatch(setLoaderValue({ isLoading: false, error: true }));
        console.error(err);
      });
  }

  const InMultiSelectCaseAssetsHaveSameCategories = (): boolean => {
    const assetCategories = props.selectedItems.map(asset => asset.evidence.categories ?? []).sort();
    const isArrayEqual = assetCategories.every((val, i, arr) => val.length === arr[0].length);
    if (isArrayEqual) {
      const isAllElementSame = assetCategories.every((array) => _.isEqual([...array].sort(), [...assetCategories[0]].sort()));
      if (isAllElementSame) {
        const flattenedAssetCategories = _.flatten(assetCategories);
        const requiredCategories = setupCategories.filter((o: any) => flattenedAssetCategories.some((i) => i === o.name));
        const categoryOptions = filterCategory(requiredCategories);
        if(!hasRemoveRights)
          setFixedOptions(categoryOptions);
        setSelectedCategoryValues(categoryOptions);
        return true;
      }
      setSelectedCategoryValues([]);
      return false;
    }
    setSelectedCategoryValues([]);
    return false;
  }

  const toasterMessages = (obj: { message: string, variant: string }) => {
    toasterRef.current?.showToaster({
      message: obj.message,
      variant: obj.variant,
      duration: 5000,
      clearButtton: true,
    });
  }

  const handleActiveForm = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CategoryDropdownForm
            activeForm={activeForm}
            setActiveForm={(v) => setActiveForm(v)}
            selectedCategoryValues={selectedCategoryValues}
            setSelectedCategoryValues={(v) => setSelectedCategoryValues(v)}
            evidence={evidenceResponse}
            isCategoryEmpty={props.isCategoryEmpty}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            setRemovedOption={(o: any) => setRemovedOption(o)}
            setModalTitle={(i: any) => setModalTitle(i)}
            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
            setIndicateTxt={(e: any) => setIndicateTxt(e)}
            isMultiSelectAssetHaveSameCategory={isMultiSelectAssetHaveSameCategory}
            selectedItems={props.selectedItems}
            fixedOptions={fixedOptions}
          />
        );
      case 1:
        return (
          <CategoryForm
            activeForm={activeForm}
            setActiveForm={(v: any) => setActiveForm(v)}
            selectedCategoryValues={selectedCategoryValues}
            evidence={evidenceResponse}
            isCategoryEmpty={props.isCategoryEmpty}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            setSelectedCategoryValues={(v) => setSelectedCategoryValues(v)}
            setModalTitle={(i: any) => setModalTitle(i)}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            setIndicateTxt={(e: any) => setIndicateTxt(e)}
            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
            setshowSSticky={(a: any) => setshowSSticky(a)}
            categorizedBy={props.categorizedBy}
            isCategorizedBy={props.isCategorizedBy}
            setRemovalType={(e: CategoryRemovalType) => setRemovalType(e)}
            isMultiSelectAssetHaveSameCategory={isMultiSelectAssetHaveSameCategory}
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
            IsformUpdated={IsformUpdated}
            toasterMessages={(obj: { message: string, variant: string }) => toasterMessages(obj)}
          />
        );
      case 2:
        return (
          <CancelConfirmForm
            setActiveForm={(v: any) => setActiveForm(v)}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            setSelectedCategoryValues={(v) => setSelectedCategoryValues(v)}
            isCategoryEmpty={props.isCategoryEmpty}
            removedOption={removedOption}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            setRemovedOption={(v: any) => setRemovedOption(v)}
            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
            previousActive={previousValueState}
            setModalTitle={(i: any) => setModalTitle(i)}
            setIndicateTxt={(e: any) => setIndicateTxt(e)}
          />
        );
      case 3:
        return (
          <RemoveCategoryForm
            setActiveForm={(v: any) => setActiveForm(v)}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            selectedCategoryValues={selectedCategoryValues}
            setSelectedCategoryValues={(v) => setSelectedCategoryValues(v)}
            setModalTitle={(i: any) => setModalTitle(i)}
            removedOption={removedOption}
            evidence={evidenceResponse}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            setDifferenceOfRetentionTime={(v: string) => setDifferenceOfRetentionTime(v)}
            setRemovedOption={(e: any) => setRemovedOption(e)}
            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
            setRemovalType={(e: CategoryRemovalType) => setRemovalType(e)}
            setRemoveMessage={(e: string) => setRemoveMessage(e)}
            setHoldUntill={(e: string) => setHoldUntill(e)}
            setIndicateTxt={(e: any) => setIndicateTxt(e)}
            selectedItems={props.selectedItems}
          />
        );
      case 4:
        return (
          <RemoveCategoryConfirmForm
            setActiveForm={(v: any) => setActiveForm(v)}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            setSelectedCategoryValues={(v) => setSelectedCategoryValues(v)}
            setModalTitle={(i: any) => setModalTitle(i)}
            removedOption={removedOption}
            evidence={evidenceResponse}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            differenceOfRetentionTime={differenceOfRetentionTime}
            setRemovedOption={(e: any) => setRemovedOption(e)}
            setIndicateTxt={(e: any) => setIndicateTxt(e)}
            removalType={removalType}
            removeMessage={removeMessage}
            holdUntill={holdUntill}
            categorizedBy={props.categorizedBy}
            isCategorizedBy={props.isCategorizedBy}
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
            toasterMessages={(obj: { message: string, variant: string }) => toasterMessages(obj)}
          />
        );
      case 5:
        return (
          <EditConfirmForm
            setActiveForm={(v: any) => setActiveForm(v)}
            setOpenForm={() => props.setOpenForm()}
            closeModal={(v: any) => setOpenModal(v)}
            evidence={evidenceResponse}
            setModalTitle={(i: any) => setModalTitle(i)}
            setremoveClassName={(v: any) => setremoveClassName(v)}
            setIsformUpdated={(e: boolean) => setIsformUpdated(e)}
            categorizedBy={props.categorizedBy}
            isCategorizedBy={props.isCategorizedBy}
            removalType={removalType}
            selectedCategoryValues={selectedCategoryValues}
            isCategoryEmpty={props.isCategoryEmpty}
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
            toasterMessages={(obj: { message: string, variant: string }) => toasterMessages(obj)}
          />
        );
    }
  };

  return (
    <>
      <CRXToaster ref={toasterRef} className="categoryFormToaster" />
      <div className='categoryFormContainer'>
        <CRXModalDialog
          maxWidth='lg'
          title={modalTitle}
          className={'CRXModal ' + removeClassName}
          modelOpen={openModal}
          onClose={handleClose}
          defaultButton={false}
          indicatesText={indicateTxt}
          showSticky={showsSticky}
        >
          {handleActiveForm(activeForm)}
        </CRXModalDialog>
      </div>
    </>
  );
});

export default CategoryFormContainer;
