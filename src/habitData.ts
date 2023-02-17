import d from "./data.json";

export const data = d.results.map((r) => {
  const { created_time, properties } = r;
  const checks = Object.entries(properties)
    .filter(([name, v]) => {
      const { type } = v;
      return type === "checkbox";
    })
    .map(([name, v]) => {
      const { checkbox } = v as any;
      return [name, checkbox];
    });
  const checkMap = Object.fromEntries(checks);
  return { created_time, checks: checkMap };
});
