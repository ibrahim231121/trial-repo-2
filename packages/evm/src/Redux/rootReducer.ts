import counterReducer from './counterReducer';
import counterTwoReducer from './counterTwoReducer';
import pathNameReducer from './pathNameReducer';

//combine Reducers
export const reducer = {
    counter:counterReducer.reducer,
    counterTwo: counterTwoReducer.reducer,
    pathName:pathNameReducer.reducer
  }
 