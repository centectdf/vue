<script setup>
import { computed, defineProps } from "vue";
import { Radar } from "vue-chartjs";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Recibir los datos desde los props
const props = defineProps({
  ingresados: String,
  enproceso: String,
  calib_finalizada: String,
  cert_emitido: String,
  cert_aprobado: String,
  enespera: String
});

// Computed para calcular los datos del gráfico dinámicamente
const data = computed(() => ({
  labels: ["Ingresados", "En Proceso", "En espera", "Calib. Finalizada", "Cert. Emitido", "Cert. Aprobado"],
  datasets: [
    {
      label: "Estado de Servicios",
      data: [
        Number(props.ingresados),
        Number(props.enproceso),
        Number(props.calib_finalizada),
        Number(props.cert_emitido),
        Number(props.cert_aprobado),
        Number(props.enespera)
      ],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true },
      suggestedMin: 0,
      suggestedMax: Math.max(...data.value.datasets[0].data),
      scaleLabel: { display: false },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
  },
};
</script>


<template>
  <div class="tinystats">
    <Radar :data="data" :options="options" />
  </div>
</template>

<style scoped>
.tinystats {
  width: 500px; /* Aumenta el ancho */
  height: 300px; /* Reduce la altura */
}
</style>
