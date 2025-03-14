import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.9:8080/Principal/api/",
});

export default {
  login(email, password) {
    return api.post("/login.php", { email, password });
  },
  getUsuarios() {
    return api.get("/getUsuarios.php");
  },
  getClientes(){
    return api.get("/getClientes.php");
  },
  getInstrumentosClientes(){
    return api.get("/getInstrumentosClientes.php");
  },
  getOrdenes(){
    return api.get("/getOrdenes.php");
  },
  getUsuarios(){
    return api.get("/getUsuarios.php");
  },
  getIngresadosPorCliente(){
    return api.get("/getIngresadosPorCliente.php");
  },
  getClientesANotificar(){
    return api.get("/getClientesANotificar.php");
  },
  getTinyStats(){
    return api.get("/getTinyStats.php");

  },
  getTemperaturaHumedad() {
      return api.get('/getTemperaturaHumedad.php');
  }
  
};
