<script lang="ts">
  import Card from "./Card.svelte";
  import CardGoal from "./CardGoal.svelte";
  import CardTitle from "./CardTitle.svelte";
  import { data } from "./habitData";
  import { targetDaysPerWeek, targetPercentages } from "./habitGoals";

  const dateRanges = [
    { name: "week", days: 7 },
    { name: "month", days: 30 },
    { name: "year", days: 365 },
    // { name: "all", days: Infinity },
  ];

  const dataByDate = dateRanges.map(({ name, days }) => {
    const past = data.filter((d) => {
      const { created_time } = d;
      const date = new Date(created_time);
      const now = new Date();
      const diff = now - date;
      const diffdays = diff / (1000 * 60 * 60 * 24);
      return diffdays < days;
    });
    return { name, days, past };
  });

  const numChecksByDate = dataByDate.map(({ name, days, past }) => {
    const numChecks = past.reduce((acc, d) => {
      const { checks } = d;
      Object.entries(checks).forEach(([name, checked]) => {
        if (checked) {
          acc[name] = acc[name] ? acc[name] + 1 : 1;
        }
      });
      return acc;
    }, {});
    return { name, days, past, numChecks };
  });
  const calculatePercentages = (category: string) => {
    const percentages = numChecksByDate.map(({ past, numChecks }) => {
      const percent = (numChecks[category] || 0) / past.length || 0;
      const percentOfTarget = percent / targetPercentages[category] || 0;
      const clampedPercentOfTarget = Math.min(1, percentOfTarget);
      return clampedPercentOfTarget;
    });
    return percentages;
  };
  const categories = Object.keys(data[0].checks)
    .filter((k) => targetDaysPerWeek[k])
    .sort((category, nextCategory) => {
      const percentages = calculatePercentages(category);
      const nextPercentages = calculatePercentages(nextCategory);
      if (percentages[0] > nextPercentages[0]) return 1;
      else if (percentages[0] < nextPercentages[0]) return -1;
      const monthDiff = percentages[1] - nextPercentages[1];
      const yearDiff = percentages[2] - nextPercentages[2];
      const totalDiff = monthDiff + yearDiff;
      if (totalDiff > 0) return 1;
      else if (totalDiff < 0) return -1;
      return 0;
    });
</script>

<main
  class="flex flex-wrap items-start justify-start p-2 font-sans text-black dark:text-white 
  {import.meta.env.DEV ? 'dark:bg-gray-900' : ''}"
>
  {#each categories as category}
    <Card>
      <div class="flex items-center justify-between">
        <CardTitle>{category}</CardTitle>
        <CardTitle>
          <span class="opacity-50">
            Goal: {targetDaysPerWeek[category] || targetDaysPerWeek._default}/7
          </span>
        </CardTitle>
      </div>
      <div class="flex items-start justify-start gap-2">
        {#each numChecksByDate as { past, numChecks }}
          <CardGoal
            denominator={past.length}
            numerator={numChecks[category] || 0}
            targetPercent={targetPercentages[category]}
          />
        {/each}
      </div>
    </Card>
  {/each}
  <Card>
    <CardTitle>
      Last refreshed: {new Date().toLocaleString()}
    </CardTitle>
    <CardTitle>
      Last built: {new Date(
        parseInt(import.meta.env.VITE_LAST_BUILD) * 1000
      ).toLocaleString()}
    </CardTitle>
  </Card>
</main>
