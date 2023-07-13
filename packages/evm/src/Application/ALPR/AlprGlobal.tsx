
interface toasterObject {
  message: string;
  variant: string;
}

const TOASTER_DURATION = 7000;

export const alprToasterMessages = (toasterObj: toasterObject, messageFormReference: any, toasterDuration: number = 0) => {
  messageFormReference.current.showToaster({
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
  GRID_CONST: {
    DROPDOWN_PAGE_SIZE: 1000,
    DEFAULT_GRID_PAGE_SIZE: 25,
  },

  TOASTER_CONST: {
    DURATION: 7000,
    ERROR_VARIANT: 'error',
    SUCCESS_VARIANT: 'success',
    Info_VARIANT: 'info',
  },

  DATETIME_FORMAT: 'YYYY / MM / DD HH:mm:ss',
}

export const gridAlignment=(AlignmentType:string):string=>
{
  switch (AlignmentType.toLowerCase()) {
    case 'number':
      return 'left' 
    case 'text' || 'string':
      return 'left' 
    case 'datetime' || 'date':
      return 'centre' 
    default:
      return 'left'
  }
} 

