import React, { useEffect, useRef, useState } from 'react';
import { CRXModalDialog } from '@cb/shared';
import { CRXButton } from '@cb/shared';
import { CRXAlert } from '@cb/shared';
import { TextField } from '@cb/shared';
import { EVIDENCE_SERVICE_URL } from '../../utils/Api/url';
import "./VideoPlayer.scss";

type VideoPlayerSnapshotFormProps = {
  description: string;
  imageString: string;
};

type VideoPlayerSnapshotProps = {
  openForm: boolean;
  data: any;
  setOpenForm: any;
  snapshot: any;
};
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

const VideoPlayerSnapshot: React.FC<VideoPlayerSnapshotProps> = React.memo((props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [removeClassName, setremoveClassName] = React.useState('');
  const [alert, setAlert] = React.useState<boolean>(false);
  const [responseError, setResponseError] = React.useState<string>('');
  const [alertType, setAlertType] = useState<string>('inline');
  const [errorType, setErrorType] = useState<string>('error');
  const alertRef = useRef(null);
  const [onSave,setOnSave] = useState(true);

  const [formpayload, setFormPayload] = React.useState<VideoPlayerSnapshotFormProps>({
    description: '',
    imageString: props.snapshot,
  });

  const [formpayloadErr, setFormPayloadErr] = React.useState({
    descriptionErr: '',
    imageStringErr: '',
  });

  React.useEffect(() => {
    setOpenModal(props.openForm)
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    setOpenModal(false);
    props.setOpenForm(false);
  };

  useEffect(() => {
    formpayload.description.length > 0 ? setOnSave(false) : setOnSave(true);
  }, [formpayload.description]);

  const onAdd = async () => {
    const formdata = formpayload;
    var guid = create_UUID();
    const request = {
      "name": "Image_" + guid + "_" + formdata.description,
      "typeOfAsset": "Image",
      "state": "Normal",
      "status": "Uploading",
      "unitId": 9,
      "duration": 14,
      "recordedByCSV": "98p",
      "bookMarks": [
        {
          "bookmarkTime": "2022-02-04T09:33:34.650Z",
          "position": 10,
          "description": "Bookmark 2",
          "madeBy": "Trigger"
        }
      ],
      "files": [
        {
          "name": "FILE_Image_" + guid + "_" + formdata.description,
          "type": "Image",
          "extension": "jpeg",
          "url": formdata.imageString,
          "size": 1280,
          "sequence": 6,
          "duration": 3600,
          "checksum": {
            "checksum": "bc527343c7ffc103111f3a694b004e2f",
            "algorithm": "SHA-256",
            "status": true
          },
          "recording": {
            "started": "2021-10-19T15:30:19Z",
            "ended": "2021-10-19T21:30:19Z"
          }
        }
      ],
      "owners": [
        10
      ],
      "lock": {
        "roles": []
      },
      "recording": {
        "started": "2021-10-19T15:30:19Z",
        "ended": "2021-10-19T15:30:19Z"
      },
      "isRestrictedView": false,
      "buffering": {
        "pre": 5,
        "post": 5
      },
      "audioDevice": null,
      "camera": null,
      "isOverlaid": true

    };
    await fetch(EVIDENCE_SERVICE_URL + "/Evidences/1/Assets", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', TenantId: '1' },
      body: JSON.stringify(request)
    })
      .then(function (res) {
        if (res.ok) return res.json();
        else if (res.status == 500) {
          setAlert(true);
          setResponseError(
            "We're sorry. The form was unable to be saved. Please retry or contact your System Administrator."
          );
        } else return res.text();
      })
      .then((resp) => {
        if (resp !== undefined) {
          let error = JSON.parse(resp);
          if (error.errors !== undefined) {
            // if (error.errors.UserName !== undefined && error.errors.UserName.length > 0) {
            //   setAlert(true);
            //   setResponseError(error.errors.UserName[0]);
            // }
          }
          else if (!isNaN(+error)) {
            setOpenModal(false);
            props.setOpenForm(false);
          } else {
            setAlert(true);
            setResponseError(error);
          }
        }
      })
      .catch(function (error) {
        return error;
      });
  };



  const onSubmit = async (e: any) => {
    setResponseError('');
    setAlert(false);
    await onAdd();
  };

  const checkDescription = () => {
    if (!formpayload.description) {
      setFormPayloadErr({
        ...formpayloadErr,
        descriptionErr: 'Description is required'
      });
    }
    else {
      setFormPayloadErr({ ...formpayloadErr, descriptionErr: '' });
    }
  }


  return (
    <div className='videoPlayerSnapshot'>
      <CRXModalDialog
        maxWidth="gl"
        title="Snapshot"
        className={'CRXModal ' + removeClassName}
        modelOpen={openModal}
        onClose={handleClose}
        defaultButton={false}
        showSticky={false}
      >
        <div className=''>
          <CRXAlert
            ref={alertRef}
            message={responseError}
            className='crxAlertSnapShotEditForm'
            alertType={alertType}
            type={errorType}
            open={alert}
            setShowSucess={() => null}
          />
          <div className='modalEditCrx'>
            <div className='CrxEditForm'>
              <TextField 
                error={!!formpayloadErr.descriptionErr}
                errorMsg={formpayloadErr.descriptionErr}
                required={true}
                value={formpayload.description}
                label='Description'
                className='description-input'
                onChange={(e: any) => setFormPayload({ ...formpayload, description: e.target.value })}
                onBlur={checkDescription}
              />
              <div className='custom-class'>
                <div >
                  <label>Preview</label>
                </div>
                <img src={props.snapshot}></img>
              </div>

            </div>
            <div className='crxFooterEditFormBtn'>
              <CRXButton className='primary' onClick={onSubmit} disabled={onSave}>
                Save
              </CRXButton>
              <CRXButton className='secondary' onClick={handleClose}>
                Cancel
              </CRXButton>
            </div>
          </div>
        </div>


      </CRXModalDialog>
    </div>
  );
});

export default VideoPlayerSnapshot;