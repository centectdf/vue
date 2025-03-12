import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.9:8080/Principal/api/",
});

export default {
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
  }
  
};
