import g from "./goals.json";
export const targetDaysPerWeek = Object.fromEntries(
  g.results
    .map(({ properties }) => {
      if (
        properties?.Name?.title[0]?.plain_text &&
        properties["Days per week"]?.number
      ) {
        return [
          properties.Name.title[0].plain_text,
          properties["Days per week"].number,
        ];
      }
    })
    .filter(Boolean)
);
export const targetPercentages = Object.fromEntries(
  Object.entries(targetDaysPerWeek).map(([k, v]: [string, number]) => [
    k,
    v / 7,
  ])
);
