import counterReducer from './counterReducer';
import counterTwoReducer from './counterTwoReducer';
import pathNameReducer from './breadCrumbReducer';

//combine Reducers
export const reducer = {
    counter:counterReducer.reducer,
    counterTwo: counterTwoReducer.reducer,
    pathName:pathNameReducer.reducer
  }
 