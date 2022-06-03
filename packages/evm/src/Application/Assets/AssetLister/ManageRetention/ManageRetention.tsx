import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { MultiSelectBoxCategory, CRXCheckBox, CRXRadio } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../../Redux/rootReducer";
import { USER_INFO_GET_URL } from '../../../../utils/Api/url'
import Cookies from 'universal-cookie';
import useGetFetch from "../../../../utils/Api/useGetFetch";
import { EVIDENCE_SERVICE_URL } from "../../../../utils/Api/url";
import moment from "moment";
import { log } from 'console';

type AssignUserProps = {
  items: any[];
  filterValue: any[];
  //setFilterValue: (param: any) => void;
  rowData: any;
  setOnClose: () => void;
  setRemovedOption: (param: any) => void;
};

const cookies = new Cookies();

const AssignUser: React.FC<AssignUserProps> = (props) => {

  const dispatch = useDispatch();
  const [buttonState, setButtonState] = React.useState<boolean>(false);


  type Retentionmodel = {
    value: string;
    label: string;
    Comp: any;
  };
  type assetModel = {
    master: any,
    children: any
  }
  type stationModel = {
    CMTFieldValue: number
  }
  type RetentionPolicyModel = {
    CMTFieldValue: number
  }

  type evidenceModel = {
    Id: any,
    ExtendedDays: number,
  }


  const [retention, setRetention] = React.useState<string>("")
  const [currentRetention, setCurrentRetention] = React.useState<string>("-")
  const [originalRetention, setOriginalRetention] = React.useState<string>("-")

  const [retentionList, setRetentionList] = React.useState<evidenceModel[]>([])

  const [retentionDays, setRetentionDays] = React.useState<number>(0)
  let retentionRadio = [
    {
      value: "1", label: "Extend retention by days", Comp: () => { }
    },
    {
      value: "2", label: "Extend retention Indefinitely", Comp: () => { }
    }
  ]

  const [retentionOpt, setRetentionOpt] = React.useState<Retentionmodel[]>(retentionRadio)

  React.useEffect(() => {
    debugger;
    if (retentionList.length > 0) {
      sendData();
    }
    console.log('Curr_Retention',currentRetention);
  }, [retentionList]);

  React.useEffect(() => {
    if (props.items.length <= 1)
      getRetentionData();

  }, []);
  React.useEffect(() => {
    if (retention != "1") {
      setRetentionDays(0);
    }
  }, [retention]);


  const getRetentionData = async () => {
    const url = EVIDENCE_SERVICE_URL + "/Evidences/" + `${props.rowData.id}`

    const res = await fetch(url, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json', TenantId: '1' },
    })
    var response = await res.json();
    if (response != null) {
      setOriginalRetention(moment(response.retainUntil).format('DD-MM-YYYY HH:MM:ss'));
      if (response.extendedRetainUntil != null) {
        debugger;
        console.log('curr_ret_moment ',moment(response.extendedRetainUntil).format('DD-MM-YYYY'));
        if(moment(response.extendedRetainUntil).format('DD-MM-YYYY') == "31-12-9999")
        {
          setCurrentRetention("Indefinite");
        }
        else
        {
        setCurrentRetention(moment(response.extendedRetainUntil).format('DD-MM-YYYY HH:MM:ss'));
        }
        setRetentionOpt((prev: any) => [...prev, { value: "3", label: "Revert to original retention", Comp: () => { } }])
      }

    }
  }

  const onSubmitForm = async () => {
    console.log('Props_Items', props.items[0]);

    if (props.filterValue?.length !== 0) {
    }
    debugger;
    var sdaasd = [...retentionList];
    if (props.items.length > 1) {
      props.items.forEach((el) => {
        var evidenceData: evidenceModel = {
          Id: el.evidence.id,
          ExtendedDays: retentionDays
        }
        sdaasd.push(evidenceData)
      })
    }
    else
    {
      var evidenceData: evidenceModel = {
        Id: props.rowData.id,
        ExtendedDays: retentionDays
      }
      sdaasd.push(evidenceData)
    }
    setRetentionList(sdaasd)


  };
  const sendData = async () => {
    debugger;
    const url = EVIDENCE_SERVICE_URL + '/Evidences/Retention/' + `${retention}`
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', TenantId: '1', 'Authorization': `Bearer ${cookies.get('access_token')}` },
      body: JSON.stringify(retentionList)
    })
      .then(function (res) {
        if (res.ok) {
          props.setOnClose();
        } else if (res.status == 500) {

        }
      })
      .catch(function (error) {
        return error;
      })
  }

  const cancelBtn = () => {
    props.setOnClose();
  };

  return (
    <>
      <div style={{ height: "270px" }}>
        <Formik initialValues={{}} onSubmit={() => onSubmitForm()}>
          {() => (
            <Form>
              <div >
                <div>Extend {props.items.length > 1 ? props.items.length : 1} Assets</div>
                <CRXRadio
                  className='crxEditRadioBtn'
                  disableRipple={true}
                  content={retentionOpt}
                  value={retention}
                  setValue={setRetention}
                />

                <input type="number" disabled={retention == "1" ? false : true} value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))} />
              </div>
              <div>
                <h4>Original Retention: {originalRetention}</h4>
                <h4>Current Retention: {currentRetention}</h4>
                <br></br>
                <br></br>

              </div>

              <div className='modalFooter CRXFooter'>
                <div className='nextBtn'>
                  <CRXButton type='submit' className={'nextButton ' + buttonState && 'primeryBtn'} disabled={buttonState}>
                    Save
                  </CRXButton>
                </div>
                <div className='cancelBtn'>
                  <CRXButton onClick={cancelBtn} className='cancelButton secondary'>
                    Cancel
                  </CRXButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AssignUser;
