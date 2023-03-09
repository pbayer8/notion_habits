<script lang="ts">
  export let denominator, numerator, targetPercent, warn, checks;
  const percentHues = () => {
    const percent = numerator / denominator || 0;
    const percentOfTarget = percent / targetPercent || 0;
    const clampedPercentOfTarget = Math.min(1, percentOfTarget);
    const hue = (clampedPercentOfTarget * 120).toFixed(0);
    return hue;
  };
  $: hue = percentHues();
</script>

<div
  class="relative overflow-hidden rounded p-2"
  style:background="hsl({hue}, var(--card-saturation), var(--card-lightness))"
>
  <h3 class="m-0 text-5xl">{numerator}</h3>
  <p class="m-0 text-sm leading-3">/ {denominator} days</p>
  {#if warn}
    <p class="absolute top-1 right-1">*</p>
  {/if}
  <div class="absolute bottom-0 left-0 right-0 flex h-0.5">
    {#each checks as check}
      <div
        class="flex-1 rounded-full"
        style:background="hsl({hue}, var(--card-saturation),
        var(--dash-lightness))"
        style:opacity={check ? 1 : 0}
      />
    {/each}
  </div>
</div>

<style>
  div {
    --card-lightness: 80%;
    --dash-lightness: 40%;
    --card-saturation: 90%;
  }
  @media (prefers-color-scheme: dark) {
    div {
      --card-lightness: 20%;
      --dash-lightness: 40%;
      --card-saturation: 70%;
    }
  }
</style>
