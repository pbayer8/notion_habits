<script>
  import d from "./data.json";
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
  const categories = data[0].checks.map((c) => c.name);
  const pastWeek = data.filter((d) => {
    const { created_time } = d;
    const date = new Date(created_time);
    const now = new Date();
    const diff = now - date;
    const days = diff / (1000 * 60 * 60 * 24);
    return days < 7;
  });
  const pastMonth = data.filter((d) => {
    const { created_time } = d;
    const date = new Date(created_time);
    const now = new Date();
    const diff = now - date;
    const days = diff / (1000 * 60 * 60 * 24);
    return days < 30;
  });
  const pastYear = data.filter((d) => {
    const { created_time } = d;
    const date = new Date(created_time);
    const now = new Date();
    const diff = now - date;
    const days = diff / (1000 * 60 * 60 * 24);
    return days < 365;
  });
  const numChecksPastWeek = pastWeek.reduce((acc, d) => {
    const { checks } = d;
    Object.entries(checks).forEach(([name, checked]) => {
      if (checked) {
        acc[name] = acc[name] ? acc[name] + 1 : 1;
      }
    });
    return acc;
  }, {});
  const numChecksPastMonth = pastMonth.reduce((acc, d) => {
    const { checks } = d;
    Object.entries(checks).forEach(([name, checked]) => {
      if (checked) {
        acc[name] = acc[name] ? acc[name] + 1 : 1;
      }
    });
    return acc;
  }, {});
  const numChecksPastYear = pastYear.reduce((acc, d) => {
    const { checks } = d;
    Object.entries(checks).forEach(([name, checked]) => {
      if (checked) {
        acc[name] = acc[name] ? acc[name] + 1 : 1;
      }
    });
    return acc;
  }, {});
  const numChecks = data.reduce((acc, d) => {
    const { checks } = d;
    Object.entries(checks).forEach(([name, checked]) => {
      if (checked) {
        acc[name] = acc[name] ? acc[name] + 1 : 1;
      }
    });
    return acc;
  }, {});
</script>

<main>
  {#each categories as category}
    <div>
      <h2>{category}</h2>
      <p>
        {numChecksPastWeek[category]} / {pastWeek.length} past week
      </p>
      <p>
        {numChecksPastMonth[category]} / {pastMonth.length} past month
      </p>
      <p>
        {numChecksPastYear[category]} / {pastYear.length} past year
      </p>
      <p>
        {numChecks[category]} / {data.length} total
      </p>
    </div>
  {/each}
</main>

<style>
</style>
