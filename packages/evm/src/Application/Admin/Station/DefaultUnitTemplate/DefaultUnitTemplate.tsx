import React from 'react';
import { CRXDataTable, CRXButton, CRXConfirmDialog } from '@cb/shared';
import textDisplay from '../../../../GlobalComponents/Display/TextDisplay';
import { HeadCellProps, PageiGrid } from '../../../../GlobalFunctions/globalDataTableFunctions';
import DropdownComponent from './DropdownComponent';
import { StationInfo, TypeOfDevice } from './DefaultUnitTemplateModel';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CRXAlert } from '@cb/shared';
import { useTranslation } from 'react-i18next';
import { UnitsAndDevicesAgent } from '../../../../utils/Api/ApiAgent';
import { DeviceType } from '../../../../utils/Api/models/UnitModels';
import { getConfigurationTemplatesAsync } from '../../../../Redux/ConfigurationTemplatesReducer';

const DefaultUnitTemplate: React.FC = () => {
    const { t } = useTranslation<string>();
    const history = useHistory();
    const [selectBoxValues, setSelectBoxValues] = React.useState<any[]>([]); // <= State Of SelectBox Values.
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [stationDataTableRow, setStationDataTableRow] = React.useState<StationInfo[]>([]);
    const [headCellState, setHeadCellState] = React.useState<HeadCellProps[]>([]);
    const [deviceTypeCollection, setDeviceType] = React.useState<DeviceType[]>([]);
    const [stationCollection, setStationCollection] = React.useState<any[]>([]);
    const [disableSaveBtn, setDisableSaveBtn] = React.useState<boolean>(true);
    const [isStateChanged, setIsStateChanged] = React.useState<boolean>(false);
    const [confirmModalDisplay, setConfirmModalDisplay] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
    const [paging, setPaging] = React.useState<boolean>();
    const [pageiGrid, setPageiGrid] = React.useState<PageiGrid>({
        gridFilter: {
            logic: "and",
            filters: []
        },
        page: page,
        size: rowsPerPage
    });
    const configurationTemplatesFromStore = useSelector((state: any) => state.configurationTemplatesSlice.configurationTemplates);
    const dispatch = useDispatch();
    React.useEffect(() => {
        getDeviceTypeRecord();
        if (!(configurationTemplatesFromStore) || Object.keys(configurationTemplatesFromStore).length === 0) {
            dispatch(getConfigurationTemplatesAsync());
        }
    }, []);

    React.useEffect(() => {
        /**
        * * Create HeaderCell For DataTable.
        * */
        if ((deviceTypeCollection.length > 0)) {
            const headCellArray: HeadCellProps[] = [];
            const headerColumnCollection = [];
            headerColumnCollection.push({
                id: 1,
                name: '',
                type: 'text',
                dropdown_policy_id: 'name',
            });
            for (const deviceObj of deviceTypeCollection) {
                const headerCol = {
                    id: deviceObj.id + 1,
                    name: deviceObj.name,
                    type: 'dropdown',
                    dropdown_policy_id: deviceObj.id,
                }
                headerColumnCollection.push(headerCol);
            }
            for (const headerColObj of headerColumnCollection) {
                const headCellObject: HeadCellProps = {
                    label: headerColObj.name ?? "",
                    id: headerColObj.dropdown_policy_id,
                    align: 'center',
                    dataComponent: (e: any, rowId: any) => headerColObj.type === 'text' ? textDisplay(e, "") : dropdownDataComponent(e, rowId, headerColObj.dropdown_policy_id, configurationTemplatesFromStore, selectBoxValues),
                    sort: false,
                    searchFilter: false,
                    searchComponent: () => null,
                    visible: true,
                    minWidth: '80',
                    maxWidth: '100'
                };
                headCellArray.push(headCellObject);
            }
            headCellArray.push({
                label: t("To_Get_ID"),
                id: 'id',
                align: 'center',
                dataComponent: () => null,
                sort: false,
                searchFilter: false,
                searchComponent: () => null,
                keyCol: true,
                visible: false,
            });
            setHeadCellState(headCellArray);
        }
        /**
         * * Write Initial State OF SelectBoxes. 
         * */
        if ((stationCollection.length > 0) && (selectBoxValues.length === 0)) //  Second Condtion Make It Run Only Once.
            createInitialStateOfSelectBox();
    }, [deviceTypeCollection, selectBoxValues, stationCollection, configurationTemplatesFromStore]);

    React.useEffect(() => {
        if (paging) {
            getAllStationRecord();
        }
        setPaging(false);
    }, [pageiGrid]);

    React.useEffect(() => {
        setPageiGrid({ ...pageiGrid, page: page, size: rowsPerPage });
        setPaging(true)
    }, [page, rowsPerPage]);

    const getDeviceTypeRecord = () => {
        UnitsAndDevicesAgent.getAllDeviceTypes()
            .then((response: DeviceType[]) => {
                const shownDevices = response.filter(x => x.showDevice === true);
                setDeviceType(shownDevices);
            })
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }

    const getAllStationRecord = () => {
        UnitsAndDevicesAgent.getAllStations(`?Page=${pageiGrid.page + 1}&Size=${pageiGrid.size}`, [{ key: 'InquireDepth', value: 'deep' }])
            .then((response: any) => {
                setStationCollection(response.data);
                let stationInfo = response.data.map((x: any) => {
                    return {
                        id: x.id,
                        name: x.name
                    } as StationInfo
                }) as StationInfo[];
                setStationDataTableRow(stationInfo)
            })
            .catch((error: any) => {
                console.error(error.response.data);
            });
    }

    const manipulateSelectBoxValueResponse = (e: any, _stationId: number) => {
        setSelectBoxValues((newObject) => {
            let values = newObject.filter((o: any) => {
                if (o.stationId !== _stationId) {
                    return o;
                } else {
                    if (o.deviceTypeId !== e.deviceTypeId) {
                        return o;
                    }
                }
            });
            let operationType = 0;
            const isAddCase = newObject.length === values.length; // If Value Doesn't Change It Means Its Add Case.
            isAddCase ? operationType = 2 : operationType = 1;
            const stationPolicyId = stationCollection.find((x: any) => parseInt(x.id) === _stationId).policies[0].id;
            return [...values, { stationId: _stationId, deviceTypeId: e.deviceTypeId, templateId: e.templateId, StationPolicyId: parseInt(stationPolicyId), operationType: operationType }]
        });
        /**
         * ! If state is changed it means, user has changed the parameters of DataTable,
         * ! Enable the save button, and check the boolean flag, that state is changed,
         */
        setDisableSaveBtn(false);
        setIsStateChanged(true);
    }

    const createInitialStateOfSelectBox = () => {
        const tempArrayToHoldState = [];
        for (const station of stationCollection) {
            let tempObjectForState = station.policies[0].configurationTemplates.map((x: any) => {
                return {
                    stationId: parseInt(station.id),
                    deviceTypeId: parseInt(x.typeOfDevice.id),
                    templateId: parseInt(x.id),
                    operationType: 0,
                    StationPolicyId: parseInt(station.policies[0].id)
                }
            });
            tempArrayToHoldState.push(...tempObjectForState);
        }
        if (tempArrayToHoldState.length > 0)
            setSelectBoxValues(tempArrayToHoldState);
    }

    const saveBtnClickHandler = () => {
        UnitsAndDevicesAgent.postUpdateDefaultUnitTemplate(selectBoxValues).then(() => {
            setSuccess(true);
        })
            .catch((error: any) => {
                setError(true);
                console.error(error.response.data);
            });
    }

    const cancelBtnHandler = () => history.goBack();

    const closeBtnHandler = () => {
        if (isStateChanged) {
            setConfirmModalDisplay(true)
        } else {
            history.goBack();
        }
    }

    const closeOnConfirmBtnHandler = () => history.goBack();

    const dropdownDataComponent = (_: any, _rowId: any, _deviceTypeId: any, _configurationTemplatesFromStore: any, _selectBoxValues: any) => {
        return (
            <DropdownComponent
                deviceTypeId={parseInt(_deviceTypeId)}
                stationId={parseInt(_rowId)}
                selectBoxValue={_selectBoxValues}
                configurationTemplatesFromStore={_configurationTemplatesFromStore}
                setSelectBoxValueIntoParent={(eventFromChild: any) => manipulateSelectBoxValueResponse(eventFromChild, parseInt(_rowId))} />
        );
    }

    return (
        <>
            {success && (
                <CRXAlert
                    message={t("Success_You_have_saved_the_Default_Unit_Template")}
                    alertType="toast"
                    open={true}
                />
            )}
            {error && (
                <CRXAlert
                    className=""
                    message={t("We_re_sorry._The_form_was_unable_to_be_saved._Please_retry_or_contact_your_Systems_Administrator")}
                    type="error"
                    alertType="inline"
                    open={true}
                />
            )}
            <div className='switchLeftComponents'>
                {(headCellState.length > 0 && stationDataTableRow.length > 0)
                    &&
                    <CRXDataTable
                        id="defaultUnitTemplateDataTable"
                        getRowOnActionClick={(_: any) => { }}
                        dataRows={stationDataTableRow}
                        headCells={headCellState}
                        orderParam={"asc"}
                        searchHeader={false}
                        columnVisibilityBar={false}
                        className="ManageAssetDataTable"
                        onClearAll={null}
                        getSelectedItems={(v: string[]) => setSelectedItems(v)}
                        onResizeRow={null}
                        onHeadCellChange={null}
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}
                        showActionSearchHeaderCell={true}
                        dragVisibility={true}
                        showCheckBoxesCol={false}
                        showActionCol={false}
                        showHeaderCheckAll={false}
                        showTotalSelectedText={false}
                        showToolbar={false}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setPage={(page: any) => setPage(page)}
                        setRowsPerPage={(rowsPerPage: any) => setRowsPerPage(rowsPerPage)}
                        totalRecords={configurationTemplatesFromStore.length}
                    />
                }

                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={saveBtnClickHandler}
                    disabled={disableSaveBtn}>
                    {t("Save")}
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={cancelBtnHandler}
                    disabled={false}>
                    {t("Cancel")}
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={closeBtnHandler}
                    disabled={false}
                >
                    {t("Close")}
                </CRXButton>

                <CRXConfirmDialog
                    className="crx-unblock-modal CRXStationModal"
                    title={t("Please_confirm")}
                    setIsOpen={setConfirmModalDisplay}
                    onConfirm={closeOnConfirmBtnHandler}
                    isOpen={confirmModalDisplay}
                    primary={t("Yes_close")}
                    secondary={t("No,_do_not_close")}
                >
                    <div className='modalContentText'>
                        <div className='cancelConfrimText'>
                            {t("You_are_attempting_to")} <strong>{t("close")}</strong> {t("the")} {t("Manage_Default_Unit_Template")} {t("If_you_close_the_form")},
                            {t("any_changes_you_ve_made_will_not_be_saved.")} {t("You_will_not_be_able_to_undo_this_action.")}{' '}
                        </div>
                    </div>
                    <div className='modalBottomText modalBottomTextClose'>
                        {t("Are_you_sure_you_would_like_to")} <strong>{t("close")}</strong> {t("Manage_Default_Unit_Template")}?
                    </div>
                </CRXConfirmDialog>
            </div>
        </>
    );
}

export default DefaultUnitTemplate;