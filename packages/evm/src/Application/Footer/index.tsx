import React, { useEffect, useState } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { buildVersionNumber } from "../../version";

const Footer = React.memo((SetBottomPos : any) => {
  const { t } = useTranslation<string>();
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
