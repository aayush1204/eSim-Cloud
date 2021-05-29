import * as actions from '../actions/actions'

const initialState = {
  title: '',
  isGraph: 'false',
  text: [],
  graph: {},
  isSimRes: false,
  taskids: [],
  isGraph1: 'false',
  text1: [],
  graph1: {},
  isSimRes1: false,

}

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_RESULT_TITLE: {
      return {
        ...state,
        title: action.payload.title
      }
    }
    case actions.SET_RESULT_GRAPH: {
      return {
        ...state,
        isSimRes: true,
        isGraph: 'true',
        graph: action.payload.graph
      }
    }
    case actions.SET_RESULT_GRAPH_1: {
      return {
        ...state,
        isSimRes1: true,
        isGraph1: 'true',
        graph1: action.payload.graph
      }
    }
      

    case actions.SET_RESULT_TEXT: {
      return {
        ...state,
        isSimRes: true,
        isGraph: 'false',
        text: action.payload.text
      }
    }
      
    case actions.FETCH_TASK_IDS: {
      const taskids = []
      action.payload.forEach(element => {
        var temp = {}
        temp["task_name"] = element["task_name"]
        temp["task_id"] = element["task_id"]
        taskids.push(temp)
      })
      console.log(taskids)
      return {
        ...state,
        taskids: taskids
      }
    }  

    default:
      return state
  }
}
