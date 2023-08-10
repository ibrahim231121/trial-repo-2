import React from 'react';

const ParamUseGetFetch = <T>(
  url: string, header?: any
): [(parameter: any) => void, T, string] => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [response, setResponse] = React.useState<T>();

  const getObj = React.useCallback(async (parameter: any) => {
    const _headers =
      header == null ? { 'Content-Type': 'application/json' } : header;
    const requestOptions = {
      method: 'GET',
      headers: _headers,
    };
    const serviceUrl = url + parameter;
    try {
      const response = await fetch(serviceUrl, requestOptions);
      if (!response.ok) throw new Error(response.statusText);
      const result = await response.json();
      const data = result as T;
      await setResponse(data);
    }
    catch (err: any) {
      await setErrorMsg(err.message);
    }

  }, [header, url]);
  return [getObj, response as T, errorMsg];
};

export default ParamUseGetFetch;