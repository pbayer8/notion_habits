<script>
  import d from "./data.json";

  const targetPercentages = {
    Workout: 4 / 7,
    Write: 1 / 7,
    Bike: 2 / 7,
    Run: 1 / 7,
    Read: 5 / 7,
    "Eat healthy": 5 / 7,
    Stretch: 5 / 7,
    "Dream journal": 1 / 7,
    "Personal project": 3 / 7,
    Handstand: 2 / 7,
    "Rice bucket": 2 / 7,
    Meditate: 4 / 7,
    Climb: 3 / 7,
    default: 0.3,
  };

  const { results } = d;
  const data = results.map((r) => {
    const { created_time, properties } = r;
    const checks = Object.entries(properties)
      .filter(([name, v]) => {
        const { type } = v;
        return type === "checkbox";
      })
      .map(([name, v]) => {
        const { checkbox } = v;
        return [name, checkbox];
      });
    const checkMap = Object.fromEntries(checks);
    return { created_time, checks: checkMap };
  });
  const categories = Object.keys(data[0].checks).sort();
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
  const numChecks = data.reduce((acc, d) => {
    const { checks } = d;
    Object.entries(checks).forEach(([name, checked]) => {
      if (checked) {
        acc[name] = acc[name] ? acc[name] + 1 : 1;
      }
    });
    return acc;
  }, {});
  const hashNameToHue = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let h = hash % 360;
    return h;
  };
  // maps percentage of 0% to 100% to a gradient of red to green
  const percentHues = (percent, category) => {
    percent = percent || 0;
    const percentOfTarget =
      percent / (targetPercentages[category] || targetPercentages.default) || 0;
    const clampedPercentOfTarget = Math.min(1, percentOfTarget);
    const hue = (clampedPercentOfTarget * 120).toFixed(0);
    return `hsl(${hue}, 90%, 80%)`;
  };
</script>

<main>
  {#each categories as category}
    <div class="card">
      <h2>
        {category}
      </h2>
      <div class="times">
        {#each numChecksByDate as { name, days, past, numChecks }}
          <div
            class="time"
            style:background={percentHues(numChecks[category] / past.length)}
          >
            <h3>{numChecks[category] || 0}</h3>
            <p>/ {past.length} days</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</main>

<style>
  main {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    font-family: sans-serif;
  }
  .card {
    margin: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  }
  .times {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .time {
    padding: 0.6rem;
    margin: 0.3rem;
    border-radius: 0.3rem;
  }
  h2 {
    margin: 0;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  h3 {
    margin: 0;
    font-size: 3rem;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
  }
</style>
