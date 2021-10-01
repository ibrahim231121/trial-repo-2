import React, { useEffect } from "react";
import "./footer.scss";
import useGetFetch from "../../utils/Api/useGetFetch";
import { EVIDENCE_SEARCH_VERSION_URL } from '../../utils/Api/url'

const Footer = React.memo(() => {
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
      Copyright © Getac Video Solutions, Inc. and its subsidiaries. All rights
      reserved. | Enterprise Version: {versionNumber}
      <i
        className="fas fa-chevron-up"
        onClick={scrollTop}
        style={{ display: showScroll ? "flex" : "none" }}
      ></i>
    </div>
  );
});

export default Footer;
