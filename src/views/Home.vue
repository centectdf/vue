<template>
  <Title text="Página principal" />
  <div class="container h-80 d-flex flex-column">
    <div class="row h-40 justify-content-center">

      <div class="card col-3 me-3 h-100">
        <h5 class="card-header">Órdenes ingresadas</h5>
        <div class="card-body overflow-hidden">

          <img src="/src/assets/mock1.png" alt="Mock 1" class="w-100 h-100"/>
        </div>
      </div>
      <div class="card col-3 me-3 h-100">
        <h5 class="card-header">Disponibles para retirar</h5>
        <div class="card-body overflow-hidden">

          <img src="/src/assets/mock2.png" alt="Mock 1" class="w-100 h-100"/>

        </div>
      </div>
      <div class="card col-3 h-100">
        <h5 class="card-header">Datos</h5>
        <div class="card-body overflow-hidden">

          <img src="/src/assets/mock3.png" alt="Mock 1" class="w-100 h-100"/>
        </div>
        
      </div>

    </div>
    <div class="row h-20 justify-content-center">

      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-secondary" id="btn-in"><i class="fa fa-sign-in me-2" aria-hidden="true"></i>Ingresar instrumentos</a>
      </div>
      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-secondary" id="btn-out"><i class="fa fa-sign-out me-2" aria-hidden="true"></i>Entregar instrumentos</a>
      </div>

      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-primary ml-2" id="btn-ordenes"><i class="fa-solid fa-barcode me-2"></i>Ordenes</a>
      </div>

    </div>

    <div class="row h-40 ">
      <div class="card text-center">
        <div class="card-header">
           
        </div>
        <div class="card-body">
          <h5 class="card-title">Verificaciones y calibraciones</h5>
          <p class="card-text">Registro y seguimiento de todos los servicios de calibración y verificación de instrumentos de CENTEC-TDF.</p>
          <button class="btn btn-secondary" @click="nodisponible">Ingresar</button>

        </div>
        <div class="card-footer text-muted">
           
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Title from '/src/components/TitleMain.vue';

const nodisponible = () => {
  alert('Funcionalidad no disponible')
}

</script>

<style scoped>
#btn-in, #btn-out{
  transition:font-size 0.5s;
}
#btn-ordenes{
  transition:all 0.5s;
}
@media screen and (max-width: 1200px) {
#btn-in, #btn-out, #btn-ordenes{
  text-align:center;
  font-size:0.8em;
  height:80%;
}
#btn-ordenes{
  text-justify:center;

  align-self:center;
}
  
}

@media screen and (max-width: 990px) {
  #btn-in, #btn-out{
    height:100%;
  }
  #btn-ordenes{
    height:65%;
}

}

</style>
