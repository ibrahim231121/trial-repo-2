import React from 'react';
import './footer.scss';
import useGetFetch from '../../utils/Api/useGetFetch';

const Footer = React.memo(() => {
  const [versionNumber, setVersionNumber] = React.useState('');
  const url = '/Evidence/Version';
  const [getResponse, res] = useGetFetch<any>(url);

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
    <div className='footerDiv'>
      © Copyright 2021 IRSA Video ® | Enterprise Version {versionNumber}
      <i className='fas fa-chevron-up'></i>
    </div>
  );
});

export default Footer;
