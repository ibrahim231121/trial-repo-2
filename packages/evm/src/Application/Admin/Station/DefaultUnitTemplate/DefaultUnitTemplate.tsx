import React from 'react';
import { CRXDataTable, CRXButton, CRXConfirmDialog } from '@cb/shared';
import textDisplay from '../../../../GlobalComponents/Display/TextDisplay';
import { HeadCellProps } from '../../../../GlobalFunctions/globalDataTableFunctions';
import DropdownComponent from './DropdownComponent';
import http from '../../../../http-common';
import { DEVICETYPE_GET_URL, STATION_INFO_GET_URL, DEFAULT_UNIT_TEMPLATE_END_POINT } from '../../../../utils/Api/url';
import { StationInfo, TypeOfDevice } from './DefaultUnitTemplateModel';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CRXAlert } from '@cb/shared';

const DefaultUnitTemplate: React.FC = () => {
    const history = useHistory();
    const [selectBoxValues, setSelectBoxValues] = React.useState<any[]>([]); // <= State Of SelectBox Values.
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [stationDataTableRow, setStationDataTableRow] = React.useState<StationInfo[]>([]);
    const [headCellState, setHeadCellState] = React.useState<HeadCellProps[]>([]);
    const [deviceTypeCollection, setDeviceType] = React.useState<TypeOfDevice[]>([]);
    const [stationCollection, setStationCollection] = React.useState<any[]>([]);
    const [disableSaveBtn, setDisableSaveBtn] = React.useState<boolean>(true);
    const [isStateChanged, setIsStateChanged] = React.useState<boolean>(false);
    const [confirmModalDisplay, setConfirmModalDisplay] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);
    const [error, setError] = React.useState<boolean>(false);

    const configurationTemplatesFromStore = useSelector((state: any) => state.configurationTemplatesSlice.configurationTemplates);

    React.useEffect(() => {
        getDeviceTypeRecord();
        getAllStationRecord();
    }, []);

    React.useEffect(() => {
        console.log('selectBoxValues', selectBoxValues);
        /**
        * * Create HeaderCell For DataTable.
        * */
        if ((deviceTypeCollection.length > 0) && (selectBoxValues.length > 0)) {
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
                    label: headerColObj.name,
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
                label: 'To Get ID',
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
    }, [deviceTypeCollection, selectBoxValues, stationCollection]);

    const getDeviceTypeRecord = () => {
        http.get<TypeOfDevice[]>(DEVICETYPE_GET_URL).then(({ data }) => setDeviceType(data))
            .catch((error) => {
                console.error(error.response.data);
            });
    }

    const getAllStationRecord = () => {
        http.get(STATION_INFO_GET_URL).then(({ data }) => {
            setStationCollection(data);
            let stationInfo = data.map((x: any) => {
                return {
                    id: x.id,
                    name: x.name
                } as StationInfo
            }) as StationInfo[];
            setStationDataTableRow(stationInfo)
        })
            .catch((error) => {
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
        setSelectBoxValues(tempArrayToHoldState);
    }

    const saveBtnClickHandler = () => {
        debugger;
        const _body = JSON.stringify(selectBoxValues);
        http.post(DEFAULT_UNIT_TEMPLATE_END_POINT, _body).then((response) => {
            console.info(response);
            setSuccess(true);
        })
            .catch((error) => {
                setError(true);
                console.error(error.response.data);
            });
    }

    const cancelBtnHandler = () => {
        history.goBack();
    }

    const closeBtnHandler = () => {
        if (isStateChanged) {
            setConfirmModalDisplay(true)
        } else {
            history.goBack();
        }
    }

    const closeOnConfirmBtnHandler = () => {
        history.goBack();
    }

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
                    message="Success: You have saved the Default Unit Template"
                    alertType="toast"
                    open={true}
                />
            )}
            {error && (
                <CRXAlert
                    className=""
                    message={"We 're sorry. The Default Unit Devices are unable to be saved. Please retry or contact your Systems Administrator"}
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
                    />
                }

                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={saveBtnClickHandler}
                    disabled={disableSaveBtn}>
                    Save
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={cancelBtnHandler}
                    disabled={false}>
                    Cancel
                </CRXButton>
                <CRXButton
                    className="groupInfoTabButtons secondary"
                    onClick={closeBtnHandler}
                    disabled={false}
                >
                    Close
                </CRXButton>

                <CRXConfirmDialog
                    className="crx-unblock-modal CRXStationModal"
                    title={"Please confirm"}
                    setIsOpen={setConfirmModalDisplay}
                    onConfirm={closeOnConfirmBtnHandler}
                    isOpen={confirmModalDisplay}
                    primary={"Yes, close"}
                    secondary={"No, do not close"}
                >
                    <div className='modalContentText'>
                        <div className='cancelConfrimText'>
                            You are attempting to <strong>close</strong> the Manage Default Unit Template. If you close it, any changes
                            you've made will not be saved. You will not be able to undo this action.{' '}
                        </div>
                    </div>
                    <div className='modalBottomText modalBottomTextClose'>
                        Are you sure you would like to <strong>close</strong> Manage Default Unit Template?
                    </div>
                </CRXConfirmDialog>
            </div>
        </>
    );
}

export default DefaultUnitTemplate;