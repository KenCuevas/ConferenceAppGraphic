import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';

const BASE_URL = 'https://conference-app-v1.herokuapp.com/api/v1/sessions/';

const useStyles = makeStyles((theme) => ({
  modal:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%', 
    left:'50%',
    transform: 'translate(-50%, 50%)'
  },
  iconos:{
    cursor: 'pointer'
  },
  inputMaterial:{
    width: '100%'
  }
}))

function App() {
  const styles = useStyles();
  const [data, setData] = useState([]);

  const [modalInsertar, setModalInsertar]=useState(false);

  const [modalEditar, setModalEditar]=useState(false);

  const [modalELiminar, setModalELiminar]=useState(false);

  const [sesionSeleccionada, setSesionSeleccionada]=useState({
    session_name: '',
    session_description: '',
    session_length: '',
    speakers: ''
  })

  const handleChange = e=>{
    const {name, value}=e.target;
    setSesionSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(sesionSeleccionada);
  }


  const peticionGet = async () => {
    await axios.get(BASE_URL)
    .then(response=>{
      setData(response.data);
    })
  }
  const peticionPost = async() => {
    await axios.post(BASE_URL, sesionSeleccionada)
    .then(response=>{ 
      setData(data.concat(response.data))
     return abrirCerrarModalInsertar()
    })
  }
  const peticionPut = async () => {
    await axios.put(BASE_URL+sesionSeleccionada.id, sesionSeleccionada)
    .then(response => {
      var dataNueva=data;
      dataNueva.map(sessions => { 
        // eslint-disable-line no-use-before-define
        if  (sesionSeleccionada.id===sessions.session_id){
            sessions.session_name=sesionSeleccionada.session_name;
            sessions.session_description=sesionSeleccionada.session_description;
            sessions.session_length=sesionSeleccionada.session_length;
            sessions.speakers=sesionSeleccionada.speakers;
        }
      })
      setData(dataNueva);
      return abrirCerrarModalEditar();
    })
  }
  const peticionDelete = async () => {
    await axios.delete(BASE_URL+sesionSeleccionada.session_id)
    .then(response => {
      setData(data.filter(sesion=>sesion.id!==sesionSeleccionada.id))
      abrirCerrarModalEliminar();
    })
  }
  
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }
  
  const abrirCerrarModalEliminar=()=>{
    setModalELiminar(!modalELiminar);
  }

  const seleccionarSesion=(sesion, caso)=>{
    setSesionSeleccionada(sesion);
    (caso === 'Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet ();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar nueva sesion</h3>
      <TextField name="session_name" className={styles.inputMaterial} label="Nombre de la sesion" onChange={handleChange}></TextField>
      <TextField name="session_description" className={styles.inputMaterial} label="Descripcion de la sesion" onChange={handleChange}></TextField>
      <TextField name="session_length" className={styles.inputMaterial} label="Duracion de la sesion" onChange={handleChange}></TextField>
      <TextField name="speakers" className={styles.inputMaterial} label="Orador de la sesion" onChange={handleChange}></TextField>
      <br></br>
      <div align="rigth">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar sesion</h3>
      <TextField name="session_name" className={styles.inputMaterial} label="Nombre de la sesion" onChange={handleChange} value={sesionSeleccionada && sesionSeleccionada.session_name}></TextField>
      <TextField name="session_description" className={styles.inputMaterial} label="Descripcion de la sesion" onChange={handleChange} value={sesionSeleccionada && sesionSeleccionada.session_description}></TextField>
      <TextField name="session_length" className={styles.inputMaterial} label="Duracion de la sesion" onChange={handleChange} value={sesionSeleccionada && sesionSeleccionada.session_length}></TextField>
      <TextField name="speakers" className={styles.inputMaterial} label="Orador de la sesion" onChange={handleChange} value={sesionSeleccionada && sesionSeleccionada.speakers}></TextField>
      <br></br>
      <div align="rigth">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )
    const bodyEliminar=(
        <div className={styles.modal}>
          <p>Estas seguro de eliminar el registro <b>{sesionSeleccionada && sesionSeleccionada.session_name}</b>?</p>
          <div align="rigth">
            <Button color="secondary" onClick={()=> peticionDelete()}>Si</Button>
            <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
          </div>
        </div>
  )

  return (
    <div className="App">
      <br/>
      <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br></br>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la sesion</TableCell>
              <TableCell>Descripcion de la sesion</TableCell>
              <TableCell>Duracion de la sesion</TableCell>modalEliminar
              <TableCell>Orador asignado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(sessions=>{
              <TableRow key={sessions.session_id}>
                <TableCell>{sessions.session_name}</TableCell>
                <TableCell>{sessions.session_description}</TableCell>
                <TableCell>{sessions.session_length}</TableCell>
                <TableCell>{sessions.speakers}</TableCell>
                <TableCell>
                  <Edit className={styles.iconos} onClick={()=>seleccionarSesion(sessions, 'Editar')}/>
                  &nbsp;&nbsp;&nbsp;
                  <Delete className={styles.iconos} onClick={()=>seleccionarSesion(sessions, 'Eliminar')}/>
                </TableCell>
              </TableRow> 
              return sessions;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal>
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}
        {bodyInsertar}
      </Modal>
      
    {/*Esta es una pantalla modal que sale cuando pulsamos en boton editar*/}
    <Modal>
      open={modalEditar}
      onClose={abrirCerrarModalEditar}
      {bodyEditar}
    </Modal>

    {/*Esta es una pantalla modal que sale cuando pulsamos en boton eliminar y debera preguntarle al usuario si realmente desea eliminar la sesion*/}
    <Modal>
      open={modalELiminar}
      onClose={abrirCerrarModalEliminar}
      {bodyEliminar}
    </Modal>
  </div>
  );
}
export default App;