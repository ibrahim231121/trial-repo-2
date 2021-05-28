import React from 'react'
import { DateContextProvider } from './DateContext';
import DateTime from './DateTime'
type Props={
    getStartDate:(v:string)=>void
    getEndDate:(v:string)=>void
  }
const DateTimeComponent: React.FC<Props> = ({getStartDate,getEndDate})=> {
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    
    
    React.useEffect(() => {
      getStartDate(startDate)
      getEndDate(endDate)
    }, [endDate,startDate])

    return (
        <DateContextProvider>
              <DateTime
                  getStartDate={(val: any) => setStartDate(val)}
                  getEndDate={(val: any) => setEndDate(val)}
                />
        </DateContextProvider>
    )
}

export default DateTimeComponent
