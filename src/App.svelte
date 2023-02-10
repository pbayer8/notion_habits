<script>
  import data from './data.json';
  const {results} = data
</script>

<main>
  {#each results as r}
    {r.id}
  {/each}
</main>

<style>

</style>
