import React, { useEffect, useState } from "react";
import "./index.scss";
import useGetFetch from "../../utils/Api/useGetFetch";
import { EVIDENCE_SEARCH_VERSION_URL } from '../../utils/Api/url'
import { useTranslation } from "react-i18next";
import { getToken } from "../../Login/API/auth";
import { buildVersionNumber } from "../../version"

const Footer = React.memo((SetBottomPos : any) => {
  const { t } = useTranslation<string>();
  const [versionNumber, setVersionNumber] = React.useState("");
  const [getResponse, res] = useGetFetch<any>(EVIDENCE_SEARCH_VERSION_URL, { "Content-Type": "application/json", TenantId: "1",'Authorization': `Bearer ${getToken()}` });
  const [showScroll, setShowScroll] = React.useState(false);
  const [bottom, setBottom] = useState<any>(SetBottomPos)
  useEffect(() => {
    setBottom(SetBottomPos)
  },[bottom])
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 10) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 10) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  React.useEffect(() => {
    getResponse();
  }, [getResponse]);

  React.useEffect(() => {
    setVersionNumber(res); //res.replace(/^"|"$/g, '')
  }, [res]);

  let buildNumber : any = buildVersionNumber;
  
  return (
    <div className="footerDiv" style={{bottom : bottom + "px"}}>
      {t("Copyright_©_Getac_Video_Solutions_Inc._and_its_subsidiaries._All_rights_reserved._|_Enterprise_Version")}: {buildNumber !== undefined ? buildNumber :  "In Development" }
      {/* <i
        className="fas fa-chevron-up"
        onClick={scrollTop}
        style={{ display: showScroll ? "flex" : "none" }}
      ></i> */}
    </div>
  );
});

export default Footer;
