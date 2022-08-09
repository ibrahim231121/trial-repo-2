import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const notificationPanelMessages = createSlice({
  name: "notificationPanel",
  initialState: { notificationMessages: []},
  reducers: {

    get: (state: any) => {
        let local_notificationMessages = localStorage.getItem("notificationMessages");
        if (local_notificationMessages !== null) {
            state.notificationMessages = JSON.parse(local_notificationMessages);
        }
    },

    add: (state: any, action: PayloadAction<any>) => {
      const { payload } = action;
      if (!Array.isArray(payload)) {
          state.notificationMessages.push(payload);
      } 
      //work for local storage.
      localStorage.setItem("notificationMessages", JSON.stringify(state.notificationMessages));
    },

    remove: (state: any, action: PayloadAction<any>) => {
        const { payload } = action
        if (!Array.isArray(payload)) {
          const find = state.notificationMessages.findIndex((val: any) => val.message === payload.message)
          if (find != -1) {
            state.notificationMessages.splice(find, 1);
          }
        } else {
          const ids = payload.map(p => { return p.message });
          const newState = state.notificationMessages.filter((s: any) => !ids.includes(s.message));
          state.notificationMessages.splice(0, state.notificationMessages.length)
          state.notificationMessages.push(...newState);
        }
        //work for local storage.
        localStorage.setItem("notificationMessages", JSON.stringify(state.notificationMessages));
    },

    clearAll: (state: any, action: PayloadAction<any>) => {
        state.notificationMessages = [];
        localStorage.setItem("notificationMessages", JSON.stringify(state.notificationMessages));
    },

  },
});

export default notificationPanelMessages;

export const {
  add: addNotificationMessages,
  remove: removeNotificationMessages,
  clearAll: clearAllNotificationMessages,
  get: getNotificationMessages,
} = notificationPanelMessages.actions;
