
export type NotificationMessage = {
  title: string, 
  message: string, 
  type: string,
  date: string
}

export const setIcon: any = {
  success: "fa-check-circle",
  error: "fa-exclamation-circle",
  warning: "fa-exclamation-triangle",
  info: "fa-info-circle",
};

export const messageType: any = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Attention",
};
