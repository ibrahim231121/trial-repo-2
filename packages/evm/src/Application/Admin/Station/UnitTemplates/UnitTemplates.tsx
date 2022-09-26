import { CRXRows, CRXColumn, CRXSelectBox } from "@cb/shared";
import { useSelector } from "react-redux";
import { ConfigurationTemplate } from "../../../../utils/Api/models/UnitModels";
import { TypeOfDevice } from "../DefaultUnitTemplate/DefaultUnitTemplateModel";
import { UnitTemplatesModel } from "./UnitTemplatesModel";

const UnitTemplates = ({ values, defaultUnitTemplateSelectBoxValues, deviceTypeCollection, isAddCase, setFieldValue, setDefaultUnitTemplateSelectBoxValues }: UnitTemplatesModel): JSX.Element => {
  let Quotient = deviceTypeCollection.length / 2;
  let Remainder = deviceTypeCollection.length % 2;
  let NoOFColumnInFirstRow;
  let NoOFColumnInSecondRow;
  if (Remainder === 0) {
    NoOFColumnInFirstRow = Quotient;
    NoOFColumnInSecondRow = NoOFColumnInFirstRow;
  } else {
    NoOFColumnInFirstRow = Quotient + Remainder;
    NoOFColumnInSecondRow = Quotient;
  }
  const formatConfigurationTemplatesToMapCRXSelectBox = (collection: any[]) => {
    return collection.map((obj: any) => {
      return {
        displayText: obj.name,
        value: parseInt(obj.id)
      }
    });
  }
  const configurationTemplatesFromStore = useSelector(
    (state: any) => state.configurationTemplatesSlice.configurationTemplates
  );

  const defaultUnitTemplateChangeHandler = (e: any, deviceId: string) => {
    setDefaultUnitTemplateSelectBoxValues((previousObject: any[]) => {
      let values = previousObject.filter((o: any) => {
        return o.deviceId !== deviceId;
      });
      return [...values, { deviceId: deviceId, templateId: e.target.value.toString() }];
    });
    const templateId = e.target.value.toString();
    const searchedTemplate = configurationTemplatesFromStore.find((x: any) => x.id === templateId);
    /**
     * * operationType = 1, Update,  operationType = 2, Add
     * * 'searchedTemplate' was freezed so in order to change its property, needed to create copy of it.
     */
    const objectCopy = { ...searchedTemplate };
    let tempConfigurationTemplate = [...values.ConfigurationTemplate];
    let index = tempConfigurationTemplate.findIndex((x: any) => x.typeOfDevice.id == objectCopy.typeOfDevice.id);
    if (index != -1) {
      objectCopy.operationType = 1;
      tempConfigurationTemplate[index] = objectCopy;
      setFieldValue("ConfigurationTemplate", tempConfigurationTemplate, false);
    } else {
      objectCopy.operationType = 2;
      tempConfigurationTemplate.push(objectCopy);
      setFieldValue("ConfigurationTemplate", tempConfigurationTemplate, false);
    }
  }

  const filterOptionValuesOnTheBaseOfDeviceId = (deviceId: number) => {
    if (Object.keys(configurationTemplatesFromStore).length > 0) {
      let filteredCollection: any;
      if (!isAddCase) {
        filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
          if ((parseInt(obj.typeOfDevice.id) === deviceId)) {
            // && (obj.stationId == id)
            return obj;
          }
        });
      } else {
        filteredCollection = configurationTemplatesFromStore.filter((obj: any) => {
          if (parseInt(obj.typeOfDevice.id) === deviceId) {
            return obj;
          }
        });
      }
      return formatConfigurationTemplatesToMapCRXSelectBox(filteredCollection);
    }
    return [];
  }

  const setValueOfDefaultUnitTemplateSelectBox = (deviceTypeObj: TypeOfDevice) => {
    if (defaultUnitTemplateSelectBoxValues.length > 0) {
      if (defaultUnitTemplateSelectBoxValues.some(x => x.deviceId === deviceTypeObj.id)) {
        const filteredArray = configurationTemplatesFromStore.filter((x: any) => x.id.toString() == deviceTypeObj.id);
        const singleObject = filteredArray.map((x: any) => {
          return {
            displayText: x.name,
            value: parseInt(x.id)
          }
        })[0];
        return singleObject;
      }
    }
  }

  const setValueOfSelectBoxInUpdateCase = (deviceTypeObj: TypeOfDevice) => {
    const requiredDeviceObject = defaultUnitTemplateSelectBoxValues.find((x: any) => x.deviceId === deviceTypeObj.id)
    if (requiredDeviceObject) {
      return requiredDeviceObject.templateId.toString();
    }
  }

  return (
    <>
      <div className="stationDetailOne gepStationSetting">
        <div className="stationColumnSet">
          <CRXRows
            className="crxStationDetail"
            container="container"
            spacing={0}
          >
            {deviceTypeCollection.filter(x => x.showDevice == true).slice(0, NoOFColumnInFirstRow).map((deviceTypeObj: any) => (
              <CRXColumn
                className="stationDetailCol"
                container="container"
                item="item"
                lg={12}
                xs={12}
                spacing={0}
                key={deviceTypeObj.id}
              >
                <div className="colstation">
                  <label htmlFor="name">{deviceTypeObj.name}</label>
                  {
                    <CRXSelectBox
                      id={'simple-select-' + deviceTypeObj.id}
                      name={deviceTypeObj.id}
                      className='Autocomplete'
                      options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                      onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                      value={
                        (!isAddCase)
                          ?
                          (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                          :
                          setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                      }
                    />
                  }
                </div>
              </CRXColumn>
            ))}
          </CRXRows>
        </div>
        <div className="stationColumnSet">
          <CRXRows
            className="crxStationDetail"
            container="container"
            spacing={0}
          >
            {deviceTypeCollection.filter(x => x.showDevice == true).slice(NoOFColumnInFirstRow, NoOFColumnInFirstRow + NoOFColumnInSecondRow).map((deviceTypeObj: any) => (
              <CRXColumn
                className="stationDetailCol"
                container="container"
                item="item"
                lg={12}
                xs={12}
                spacing={0}
                key={deviceTypeObj.id}
              >
                <div className="colstation">
                  <label htmlFor="name">{deviceTypeObj.name}</label>
                  {
                    <CRXSelectBox
                      id={'simple-select-' + deviceTypeObj.id}
                      name={deviceTypeObj.id}
                      className='Autocomplete'
                      options={filterOptionValuesOnTheBaseOfDeviceId(parseInt(deviceTypeObj.id))}
                      onChange={(e: React.ChangeEvent) => defaultUnitTemplateChangeHandler(e, deviceTypeObj.id)}
                      value={
                        (!isAddCase)
                          ?
                          (defaultUnitTemplateSelectBoxValues.length > 0) && setValueOfSelectBoxInUpdateCase(deviceTypeObj)
                          :
                          setValueOfDefaultUnitTemplateSelectBox(deviceTypeObj)
                      }
                    />
                  }
                </div>
              </CRXColumn>
            ))}
          </CRXRows>
        </div>
      </div>
    </>
  );
}

export default UnitTemplates;