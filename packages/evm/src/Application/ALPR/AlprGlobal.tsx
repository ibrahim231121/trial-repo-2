import moment from "moment";

interface toasterObject {
  message: string;
  variant: string;
}

const TOASTER_DURATION = 7000;

export const alprToasterMessages = (toasterObj: toasterObject, messageFormReference: any, toasterDuration: number = 0) => {
  messageFormReference?.current?.showToaster({
    message: toasterObj.message,
    variant: toasterObj.variant,
    duration: toasterDuration === 0 ? TOASTER_DURATION : toasterDuration,
    clearButtton: true,
  });
}

export const nullValidationHandling = (validationValue: any): boolean => {
  if (validationValue !== undefined && validationValue !== null && validationValue !== '') {
    return true;
  }
  else {
    return false;
  }
}

export const AlprGlobalConstants =
{
    DEFAULT_GRID_INITIAL_PAGE:0,
    DROPDOWN_PAGE_SIZE: 1000,
    DEFAULT_GRID_PAGE_SIZE: 25,

    TOASTER_DURATION: 7000,
    TOASTER_ERROR_VARIANT: 'error',
    TOASTER_SUCCESS_VARIANT: 'success',
    TOASTER_INFO_VARIANT: 'info',
    DATETIME_FORMAT: 'YYYY / MM / DD HH:mm:ss',
}

export const gridAlignment=(AlignmentType:string):string=>
{
  switch (AlignmentType.toLowerCase()) {
    case 'number' || 'double' :
      return 'left' 
    case 'text' || 'string':
      return 'left' 
    case 'list':
      return 'left' 
    case 'datetime' || 'date' || 'icon':
      return 'centre' 
    default:
      return 'left'
  }
} 

export const convertToDateTimePicker=(dateTime:any)=>
{
  let localDateTime='';
  try
  {
    if (nullValidationHandling(dateTime) )
    {
      localDateTime = moment(dateTime)
                            .local()
                            .format("YYYY-MM-DD hh:mm");
      return localDateTime;
    }
  }
  catch(error)
  {
    console.error('error while parsing dateTime',error)  
  }
  return localDateTime;
}

export const AlprGridDateDisplayFormat = (dateTime: string) => {

  let localDateTime = '';
  try {
    if (nullValidationHandling(dateTime)) {
      localDateTime = moment(dateTime)
        .local()
        .format("YYYY / MM / DD HH:mm:ss");
      return localDateTime
    }
  }
  catch (error) {
    console.error('error while parsing dateTime', error)
  }

};

