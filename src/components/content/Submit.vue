<template>
  <div class="Submit">
    <ListChild1></ListChild1>
  </div>
</template>

<script>
  import ListChild1 from '@/components/content/contentChild/ListChild1.vue'

  export default {
    name: 'Submit',
    components:{
       ListChild1
    },
    data() {
      return {

      }
    },
    methods: {}
  }
</script>

<style scoped>
  .Submit{
    background: #FFFFFF;
    padding: 0.625rem;
    margin-top: 0.625rem;
  }
</style>
