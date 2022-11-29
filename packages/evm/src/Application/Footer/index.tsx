import React, { useEffect } from "react";
import "./index.scss";
import useGetFetch from "../../utils/Api/useGetFetch";
import { EVIDENCE_SEARCH_VERSION_URL } from '../../utils/Api/url'
import { useTranslation } from "react-i18next";

const Footer = React.memo(() => {
  const { t } = useTranslation<string>();
  const [versionNumber, setVersionNumber] = React.useState("");
  const [getResponse, res] = useGetFetch<any>(EVIDENCE_SEARCH_VERSION_URL);
  const [showScroll, setShowScroll] = React.useState(false);

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

  return (
    <div className="footerDiv">
      {t("Copyright_©_Getac_Video_Solutions_Inc._and_its_subsidiaries._All_rights_reserved._|_Enterprise_Version")}: {versionNumber}
      <i
        className="fas fa-chevron-up"
        onClick={scrollTop}
        style={{ display: showScroll ? "flex" : "none" }}
      ></i>
    </div>
  );
});

export default Footer;
