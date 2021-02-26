import counterReducer from './counterReducer';
import counterTwoReducer from './counterTwoReducer';

//combine Reducers
export const reducer = {
    counter:counterReducer.reducer,
    counterTwo: counterTwoReducer.reducer
  }
 