<template>
  <div>
    <form>
      <div>Used: <input type="number" v-model="a" /></div>
      <div>Steady Fair Share: <input type="number" v-model="b" /></div>
      <div>Instantaneous Fair Share: <input type="number" v-model="c" /></div>
      <div>Max Resources: <input type="number" v-model="d" /></div>
      <div><input type="submit" value="Update" @click.prevent="updateGauge" /></div>
    </form>
    <div id="dashboard"></div>
  </div>
</template>

<script>
  import Gauge from "./gauge"

  export default {
    name: "HelloWorld",
    data() {
      return {
        yarnResourceData: {
          "id": "application_1568616583840_0931",
          "user": "003097",
          "queue": "root.bi",
          "allocated": {
            "memory": 1024,
            "vCores": 1
          },
          "maxResources": {
            "memory": 40960,
            "vCores": 56
          },
          "usedResources": {
            "memory": 6144,
            "vCores": 6
          },
          "steadyFairResources": {
            "memory": 17645,
            "vCores": 18
          },
          "fairResources": {
            "memory": 32768,
            "vCores": 32
          }
        },
        gauge: null,
        a: 10,
        b: 20,
        c: 30,
        d: 40,
      }
    },
    methods: {
      updateGauge(v) {
        this.gauge.update(this.a, this.b, this.c, this.d)
      },
      renderGauge() {
        const config = {
          size: 500,
          label: "Memory",
          unit: 'MB'
        };
        this.gauge = new Gauge("#dashboard", config);
      },
    },
    mounted() {
      this.renderGauge();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
