import React, { useEffect } from "react";
import "./footer.scss";
import useGetFetch from "../../utils/Api/useGetFetch";

const Footer = React.memo(() => {
  const [versionNumber, setVersionNumber] = React.useState("");
  const url = "/Evidence/Version";
  const [getResponse, res] = useGetFetch<any>(url);
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

  //   useEffect(()=>{
  //       fetch(url, {
  //           method: "GET",
  //       })
  //       .then((response:Response) => response.text())
  //       .then((res) => setVersionNumber(res.replace(/^"|"$/g, '')))
  //   });

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
