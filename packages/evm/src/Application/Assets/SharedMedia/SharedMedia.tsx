import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { EVIDENCE_SERVICE_URL } from "../../../utils/Api/url";





const SharedMedia = () => {

  const [LinkStatus, setlinkStatus] = React.useState<string>("Validating...")
const queryParams = new URLSearchParams(window.location.search);
const token = queryParams.get('E');
console.log('URL: ', window.location.href);
console.log('E: ', token);

useEffect(() => {
  debugger;
  DecryptLink();
  }, []);

const DecryptLink = async () => {
debugger;
  const url = EVIDENCE_SERVICE_URL + '/OpenSharedMedia?E=' + `${token}`

  const res = await fetch(url, {
    method: 'Get',
    headers: { 'Content-Type': 'application/json', TenantId: '1' },
  })
  let response = await res.json();

  if (response != null) {
    setlinkStatus("Link is authorized")
  }
  else{
    setlinkStatus("The Link has been expired");

  }
}

    return (
        <div className="crxManageUsers switchLeftComponents manageUsersIndex">
      
      <h1>Shared Media</h1>
      <div className='categoryTitle'>
      {LinkStatus}
              </div>
    
    </div>
  );
};

export default SharedMedia;
