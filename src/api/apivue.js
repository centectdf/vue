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
  }
  
};
