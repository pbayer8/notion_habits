<script lang="ts">
  export let denominator, numerator, targetPercent;
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
  class="rounded p-2"
  style:background={`hsl(${hue}, var(--card-saturation), var(--card-lightness))`}
>
  <h3 class="m-0 text-5xl">{numerator}</h3>
  <p class="m-0 text-sm leading-3">/ {denominator} days</p>
</div>

<style>
  div {
    --card-lightness: 80%;
    --card-saturation: 90%;
  }
  @media (prefers-color-scheme: dark) {
    div {
      --card-lightness: 20%;
      --card-saturation: 70%;
    }
  }
</style>
