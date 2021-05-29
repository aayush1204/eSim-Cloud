import * as actions from './actions'
import store from '../../redux/store'
import api from '../../utils/Api'
// Actions to update title for simulation result screen
export const setResultTitle = (title) => (dispatch) => {
  dispatch({
    type: actions.SET_RESULT_TITLE,
    payload: {
      title: title
    }
  })
}

// Action to update store with graphical result points
export const setResultGraph = (graph) => (dispatch) => {
  dispatch({
    type: actions.SET_RESULT_GRAPH,
    payload: {
      graph: graph
    }
  })
}

// Action to update store with graphical result points
export const setResultGraph1 = (graph) => (dispatch) => {
  dispatch({
    type: actions.SET_RESULT_GRAPH_1,
    payload: {
      graph: graph
    }
  })
}

// Action to update store with simulation result text
export const setResultText = (text) => (dispatch) => {
  dispatch({
    type: actions.SET_RESULT_TEXT,
    payload: {
      text: text
    }
  })
}

// Action to fetch taskids
export const getTaskIds = (type) => (dispatch) => {
  
  const token = store.getState().authReducer.token
  const config = {
    headers: {
      'Authorization': `Token ${token}`
    }
  }
  
  const url = `/simulation/status/task_ids/${type}`
  api.get(url , config)
    .then(
      (res) => {
        dispatch({
          type: actions.FETCH_TASK_IDS,
          payload: res.data,
        })
        console.log(res)
      }
    )
    .catch((err) => { console.error(err) })

}
