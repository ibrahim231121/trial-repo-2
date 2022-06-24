import React from 'react';
import { CRXSelectBox } from '@cb/shared';
import { DropdownComponentProps } from './DefaultUnitTemplateModel';

const DropdownComponent: React.FC<DropdownComponentProps> = ({ deviceTypeId, stationId, configurationTemplatesFromStore, selectBoxValue, setSelectBoxValueIntoParent }) => {

    const formatConfigurationTemplatesToMapCRXSelectBox = (collection: any[]) => {
        const formatedCollection = collection.map((obj) => {
            return {
                displayText: obj.name,
                value: parseInt(obj.id)
            }
        });
        return formatedCollection;
    }

    const filterOptionValuesOnTheBaseOfDropdownId = (_deviceTypeId: number, _stationId: any) => {
        if (Object.keys(configurationTemplatesFromStore).length > 0) {
            const filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
                if ((parseInt(obj.typeOfDevice.id) === _deviceTypeId) && (obj.stationId == _stationId)) {
                    return obj;
                }
            });
            return formatConfigurationTemplatesToMapCRXSelectBox(filteredCollection);
        }
        return [];
    }

    const selectBoxOnChangeHandler = (event: any, deviceTypeId: number) => setSelectBoxValueIntoParent({ deviceTypeId: deviceTypeId, templateId: parseInt(event.target.value) });

    const setValuesOfSelectBoxOnLoad = (deviceTypeId: number, stationId: number) => {
        const filteredObject = selectBoxValue.find((x: any) => x.stationId == stationId && x.deviceTypeId == deviceTypeId);
        if (filteredObject) {
            return filteredObject.templateId;
        }
    }

    return (
        <>
            <CRXSelectBox
                id={'simple-select-' + deviceTypeId}
                className='Autocomplete'
                options={filterOptionValuesOnTheBaseOfDropdownId(deviceTypeId, stationId)}
                onChange={(e: React.ChangeEvent) => selectBoxOnChangeHandler(e, deviceTypeId)}
                value={(Object.keys(selectBoxValue).length > 0) && setValuesOfSelectBoxOnLoad(deviceTypeId, stationId)}
            />
        </>
    );
}

export default DropdownComponent;