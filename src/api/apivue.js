import axios from "axios";

const apivue = axios.create({
  baseURL: "http://192.168.1.9:8080/Principal/api/api2/",
});

export default {
  login(email, password) {
    return apivue.post("/login.php", { email, password });
  },
  getUsuarios() {
    return apivue.get("/getUsuarios.php");
  },
  getClientes(){
    return apivue.get("/getClientes.php");
  },
  getInstrumentosClientes(){
    return apivue.get("/getInstrumentosClientes.php");
  },
  getOrdenes(){
    return apivue.get("/getOrdenes.php");
  },
  getUsuarios(){
    return apivue.get("/getUsuarios.php");
  },
  getTemperaturaHumedad() {
    return apivue.get('/getTemperaturaHumedad.php');
  },
  getGestionOrdenes(){
    return apivue.get('/getOrdenesActivas.php');
  },
  getDBCheck(){
    return apivue.get('/getDBCheck.php');
  },
  getClientesActivos(){
    return apivue.get('/getClientesActivos.php');
  },
  getUltimoCambio(){
    return apivue.get('/getUltimoCambio.php');
  },
  updateUsuarioAsignado(orden,usuario){
    return apivue.post('/updateUsuarioAsignado.php',{orden,usuario});
  },
  updateEstadoOrden(orden,id_estado,id_usuario,motivo){
    return apivue.post('/updateEstadoOrden.php',{orden,id_estado,id_usuario,motivo});
  },
  updateEstado(orden,id_cambio){
    return apivue.post('/updateEstado.php',{orden,id_cambio});
  }
  
  
};
