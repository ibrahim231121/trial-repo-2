import React from 'react';

const useGetFetch = <T>(url: string, header?: any): [() => void, T, string] => {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [response, setResponse] = React.useState<T>();

  const getObj = React.useCallback(() => {
    const _headers =
      header == null ? { 'Content-Type': 'application/json' } : header;
    const requestOptions = {
      method: 'GET',
      headers: _headers,
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((response) => response as T)
      .then((response) => setResponse(response))
      .catch((error) => setErrorMsg(error.message));
  }, [header, url]);
  return [getObj, response as T, errorMsg];
};

export default useGetFetch;