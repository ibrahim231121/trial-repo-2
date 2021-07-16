import React from 'react';

const usePostFetch = <T>(
  url: string
): [(postObj: any, header?: any) => void, T, string] => {
  const [response, setResponse] = React.useState<T>();
  const [errorMsg, setErrorMsg] = React.useState('');

  const postData = React.useCallback(
    async (postObj: any, header?: any) => {
      const _headers =
        header == null ? { 'Content-Type': 'application/json' } : header;
      const requestOptions = {
        method: 'POST',
        headers: _headers,
        body: JSON.stringify(postObj),
      };
      try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(response.statusText);
        const result = await response.json();
        const data = result as T;
        await setResponse(data);
      } catch (err) {
        await setErrorMsg(err.message);
      }
    },
    [url]
  );
  return [postData, response as T, errorMsg];
};
export default usePostFetch;
