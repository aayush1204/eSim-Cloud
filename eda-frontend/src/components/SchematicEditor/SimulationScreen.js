import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Slide,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  TextField,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow

} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { useSelector, useDispatch } from 'react-redux'
import Graph from '../Shared/Graph'
import Graph1 from '../Shared/Graph1'
import api from '../../utils/Api'
import { setControlLine, setControlBlock, setResultTitle, setResultGraph1,  setResultText } from '../../redux/actions/index'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  header: {
    padding: theme.spacing(5, 0, 6),
    color: '#fff'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: '#404040',
    color: '#fff'
  }
}))

// Screen to display simulation result in graph or text format
export default function SimulationScreen ({ open, close, isResult }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const result = useSelector((state) => state.simulationReducer)
  const stitle = useSelector((state) => state.netlistReducer.title)
  const [xscale, setXScale] = React.useState('si')
  const [yscale, setYScale] = React.useState('si')
  const [precision, setPrecision] = React.useState(5)

  const [xscale1, setXScale1] = React.useState('si')
  const [yscale1, setYScale1] = React.useState('si')
  const [precision1, setPrecision1] = React.useState(5)
  const precisionArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [taskid, setTaskIds] = React.useState('')
  const scales = {
    G: 1000000000,
    M: 1000000,
    K: 1000,
    si: 1,
    m: 0.001,
    u: 0.000001,
    n: 0.000000001,
    p: 0.000000000001
  }
  const handleXScale = (evt) => {
    setXScale(evt.target.value)
  }

  const handleYScale = (evt) => {
    setYScale(evt.target.value)
  }
  const handlePrecision = (evt) => {
    setPrecision(evt.target.value)
  }

  const handleXScale1 = (evt) => {
    setXScale1(evt.target.value)
  }

  const handleYScale1 = (evt) => {
    setYScale1(evt.target.value)
  }
  const handlePrecision1 = (evt) => {
    setPrecision1(evt.target.value)
  }
  const handleTaskIds = (evt) => {
    setTaskIds(evt.target.value)
    console.log(evt.target.value)
    ResultGraph_1(evt.target.value)
    console.log(result.graph.x_points)
    console.log(result.graph1.x_points)
    // SimulationScreen(open, close, isResult)
    
  }

  useEffect(() => {
    
  }, [result] )
  // console.log(result)

  // 56493fad-9820-4224-ae35-649d6c1f51b3 the narrow one


  function ResultGraph_1(task_id)
  {
    const getUrl = 'simulation/status/'.concat(task_id)
    api
      .get(getUrl)
      .then((res) => {
        console.log(res)
        
          if (res.data.state === 'PROGRESS' || res.data.state === 'PENDING') {
            setTimeout(ResultGraph_1(taskid), 1000)
          } else {
            var result1 = res.data.details
            if (result1 === null) {
              // setIsResult(false)
            } else {
              // setIsResult(true)
              var temp = res.data.details.data
              var data = result1.data
              // console.log('DATA SIm', data)
              if (res.data.details.graph === 'true') {
                var simResultGraph = { labels: [], x_points: [], y_points: [] }
                // populate the labels
                for (var i = 0; i < data.length; i++) {
                  simResultGraph.labels[0] = data[i].labels[0]
                  var lab = data[i].labels
                  // lab is an array containeing labels names ['time','abc','def']
                  simResultGraph.x_points = data[0].x
  
                  // labels
                  for (var x = 1; x < lab.length; x++) {
                    if (lab[x].includes('#branch')) {
                      lab[x] = `I (${lab[x].replace('#branch', '')})`
                    }
                    //  uncomment below if you want label like V(r1.1) but it will break the graph showing time as well
                    //  else {
                    // lab[x] = `V (${lab[x]})`
  
                    // }
                    simResultGraph.labels.push(lab[x])
                  }
                  // populate y_points
                  for (var z = 0; z < data[i].y.length; z++) {
                    simResultGraph.y_points.push(data[i].y[z])
                  }
                }
  
                simResultGraph.x_points = simResultGraph.x_points.map(d => parseFloat(d))
  
                for (let i1 = 0; i1 < simResultGraph.y_points.length; i1++) {
                  simResultGraph.y_points[i1] = simResultGraph.y_points[i1].map(d => parseFloat(d))
                }
  
                dispatch(setResultGraph1(simResultGraph))
                console.log(result)
                
              }
              // else {
  //               var simResultText = []
  //               for (let i = 0; i < temp.length; i++) {
  //                 let postfixUnit = ''
  //                 if (temp[i][0].includes('#branch')) {
  //                   temp[i][0] = `I(${temp[i][0].replace('#branch', '')})`
  //                   postfixUnit = 'A'
  //                 } else {
  //                   temp[i][0] = `V(${temp[i][0]})`
  //                   postfixUnit = 'V'
  //                 }
  
  //                 simResultText.push(temp[i][0] + ' ' + temp[i][1] + ' ' + parseFloat(temp[i][2]) + ' ' + postfixUnit + '\n')
  //               }
  
  //               handleSimulationResult(res.data.details)
  //               dispatch(setResultText(simResultText))
  //             }
            }
          }
        


      })
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={close} TransitionComponent={Transition} PaperProps={{
        style: {
          backgroundColor: '#4d4d4d',
          boxShadow: 'none'
        }
      }}>
        <AppBar position="static" elevation={0} className={classes.appBar}>
          <Toolbar variant="dense" style={{ backgroundColor: '#404040' }} >
            <IconButton edge="start" color="inherit" onClick={close} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Simulation Result
            </Typography>
            <Button autoFocus color="inherit" onClick={close}>
              close
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" className={classes.header}>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
          >
            {/* Card to display simualtion result screen header */}
            <Grid item xs={12} sm={12}>
              <Paper className={classes.paper}>
                <Typography variant="h2" align="center" gutterBottom>
                  {result.title}
                </Typography>
                <Typography variant="h5" align="center" component="p" gutterBottom>
                  Simulation Result for {stitle} *
                </Typography>
              </Paper>
            </Grid>

            {/* Display graph result */}
            {isResult === true ? <>
              {
                (result.graph !== {} && result.isGraph === 'true')
                  ? <>
                  <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="h4" align="center" gutterBottom>
                        GRAPH OUTPUT
                      </Typography>
                      <div style={{ padding: '15px 10px 10px 10px', margin: '20px 0px', backgroundColor: 'white', borderRadius: '5px' }} >
                        <TextField
                          style={{ width: '20%' }}
                          id="xscale"
                          size='small'
                          variant="outlined"
                          select
                          label="Select X Axis Scale"
                          value={xscale}
                          onChange={handleXScale}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value='G'>
                            Giga (G)
                          </option>
                          <option value='M'>
                            Mega (MEG)
                          </option>
                          <option value='K'>
                            Kilo (K)
                          </option>
                          <option value='si'>
                            SI UNIT
                          </option>

                          <option value='m'>
                            Milli (m)
                          </option>
                          <option value='u'>
                            Micro (u)
                          </option>
                          <option value='n'>
                            Nano (n)
                          </option>
                          <option value='p'>
                            Pico (p)
                          </option>

                        </TextField>
                        <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="yscale"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Y Axis Scale"
                          value={yscale}
                          onChange={handleYScale}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value='G'>
                            Giga (G)
                          </option>
                          <option value='M'>
                            Mega (MEG)
                          </option>
                          <option value='K'>
                            Kilo (K)
                          </option>
                          <option value='si'>
                            SI UNIT
                          </option>

                          <option value='m'>
                            Milli (m)
                          </option>
                          <option value='u'>
                            Micro (u)
                          </option>
                          <option value='n'>
                            Nano (n)
                          </option>
                          <option value='p'>
                            Pico (p)
                          </option>

                        </TextField>

                        <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="precision"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Precision"
                          value={precision}
                          onChange={handlePrecision}
                          SelectProps={{
                            native: true
                          }}
                        >
                          {
                            precisionArr.map((d, i) => {
                              return (
                                <option key={i} value={d}>
                                  {d}
                                </option>
                              )
                            })
                          }

                        </TextField>
                      </div>
                      <Graph
                        labels={result.graph.labels}
                        x={result.graph.x_points}
                        y={result.graph.y_points}
                        xscale={xscale}
                        yscale={yscale}
                        precision={precision}
                      />
                    </Paper>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="h4" align="center" gutterBottom>
                        GRAPH 2 OUTPUT
                      </Typography>
                      <div style={{ padding: '15px 10px 10px 10px', margin: '20px 0px', backgroundColor: 'white', borderRadius: '5px' }} >
                        <TextField
                          style={{ width: '20%' }}
                          id="xscale"
                          size='small'
                          variant="outlined"
                          select
                          label="Select X Axis Scale"
                          value={xscale1}
                          onChange={handleXScale1}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value='G'>
                            Giga (G)
                          </option>
                          <option value='M'>
                            Mega (MEG)
                          </option>
                          <option value='K'>
                            Kilo (K)
                          </option>
                          <option value='si'>
                            SI UNIT
                          </option>

                          <option value='m'>
                            Milli (m)
                          </option>
                          <option value='u'>
                            Micro (u)
                          </option>
                          <option value='n'>
                            Nano (n)
                          </option>
                          <option value='p'>
                            Pico (p)
                          </option>

                        </TextField>
                        <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="yscale"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Y Axis Scale"
                          value={yscale1}
                          onChange={handleYScale1}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value='G'>
                            Giga (G)
                          </option>
                          <option value='M'>
                            Mega (MEG)
                          </option>
                          <option value='K'>
                            Kilo (K)
                          </option>
                          <option value='si'>
                            SI UNIT
                          </option>

                          <option value='m'>
                            Milli (m)
                          </option>
                          <option value='u'>
                            Micro (u)
                          </option>
                          <option value='n'>
                            Nano (n)
                          </option>
                          <option value='p'>
                            Pico (p)
                          </option>

                        </TextField>

                        <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="precision"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Precision"
                          value={precision1}
                          onChange={handlePrecision1}
                          SelectProps={{
                            native: true
                          }}
                        >
                          {
                            precisionArr.map((d, i) => {
                              return (
                                <option key={i} value={d}>
                                  {d}
                                </option>
                              )
                            })
                          }

                          </TextField>
                          
                          <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="taskid"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Task ID"
                          value={taskid}
                          onChange={handleTaskIds}
                          SelectProps={{
                            native: true
                          }}
                        >
                          {
                            // precisionArr.map((d, i) => {
                            //   return (
                            //     <option key={i} value={d}>
                            //       {d}
                            //     </option>
                            //   )
                            // })
                              result.taskids.map((element) => {
                                return (
                                  <option value={element["task_id"]}>
                                        {element["task_name"]}
                                  </option>
                                )

                              })
                          }

                        </TextField>
                      </div>
                      <Graph1
                        labels={result.graph1.labels}
                        x={result.graph1.x_points}
                        y={result.graph1.y_points}
                        xscale={xscale1}
                        yscale={yscale1}
                        precision={precision1}
                      />
                    </Paper>
                    </Grid>
                    </>
                  : (result.isGraph === 'true') ? <span>SOMETHING WENT WRONG PLEASE CHECK THE SIMULATION PARAMETERS.</span> : <span></span>
              }

              {/* Display text result */}
              {
                (result.isGraph === 'false')
                  ? <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                      <Typography variant="h4" align="center" gutterBottom>
                        OUTPUT
                      </Typography>
                      <div style={{ padding: '15px 10px 10px 10px', backgroundColor: 'white', margin: '20px 0px', borderRadius: '5px' }}>
                        <TextField
                          style={{ width: '20%' }}
                          id="xscale"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Scale"
                          value={xscale}
                          onChange={handleXScale}
                          SelectProps={{
                            native: true
                          }}
                        >
                          <option value='G'>
                            Giga (G)
                          </option>
                          <option value='M'>
                            Mega (MEG)
                          </option>
                          <option value='K'>
                            Kilo (K)
                          </option>
                          <option value='si'>
                            SI UNIT
                          </option>

                          <option value='m'>
                            Milli (m)
                          </option>
                          <option value='u'>
                            Micro (u)
                          </option>
                          <option value='n'>
                            Nano (n)
                          </option>
                          <option value='p'>
                            Pico (p)
                          </option>

                        </TextField>

                        <TextField
                          style={{ width: '20%', marginLeft: '10px' }}
                          id="precision"
                          size='small'
                          variant="outlined"
                          select
                          label="Select Precision"
                          value={precision}
                          onChange={handlePrecision}
                          SelectProps={{
                            native: true
                          }}
                        >
                          {
                            precisionArr.map((d, i) => {
                              return (
                                <option key={i} value={d}>
                                  {d}
                                </option>
                              )
                            })
                          }

                        </TextField>
                      </div>

                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Node/Branch</TableCell>
                              <TableCell align="center">Value</TableCell>
                              <TableCell align="center">Unit</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {result.text.map((line, index) => (
                              <TableRow key={index}>
                                <TableCell align="center">{line.split('=')[0]}</TableCell>
                                <TableCell align="center">{(parseFloat(line.split(' ')[2]) / scales[xscale]).toFixed(precision)}</TableCell>
                                <TableCell align="center">{xscale === 'si' ? '' : xscale}{line.split(' ')[3]}</TableCell>
                              </TableRow>
                            ))
                            }

                          </TableBody>
                        </Table>
                      </TableContainer>

                    </Paper>
                  </Grid>
                  : <span></span>
              } </>
              : <Grid item xs={12} sm={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center" gutterBottom>
                    SOMETHING WENT WRONG PLEASE CHECK THE SIMULATION PARAMETERS AND SCHEMATIC DIAGRAM. {/* Error handeling message in case of null result */}
                  </Typography>
                </Paper>
              </Grid>
            }
          </Grid>
        </Container>
      </Dialog>
    </div>
  )
}

SimulationScreen.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  isResult: PropTypes.bool
}
