import type {
  PerformanceItem,
  SpoilPerformanceData,
} from "@spt/hooks/apiRequests/useGetSpoilPerformanceQuery";

// Categorical colours in a fixed order, checked with the dataviz palette
// validator on the white card: slots 1–6, and slots 1–5 next to the "Other"
// gray, pass the colour-blind and normal-vision separation checks. Aqua, yellow
// and magenta are below 3:1 on white, so every value is also in the legend.
const SERIES_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"];
const OTHER_COLOR = "#77766f";
export const TRACK_COLOR = "#EEF1F4";

// A donut stays readable up to six slices; past that the smallest Spoylz fold
// into "Other".
const MAX_SLICES = SERIES_COLORS.length;
const OTHER_KEY = "__other__";

// A Spoylz as the charts track it. Titles repeat, so it's told apart by its id
// when the API sends one, else by its title and how often that title came before.
type ChartItem = {
  key: string;
  title: string;
  value: number;
  spoilId: number | null;
};

export type Series = Omit<ChartItem, "value"> & { color: string };

export type Slice = Series & {
  label: string;
  value: number;
  members?: ChartItem[];
};

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const toAmount = (value: unknown) => Number(value) || 0;

export const formatValue = (value: number, isCurrency?: boolean) =>
  `${isCurrency ? "₦" : ""}${value.toLocaleString("en-NG")}`;

export const formatCompact = (value: number, isCurrency?: boolean) =>
  `${isCurrency ? "₦" : ""}${compactNumber.format(value)}`;

export const formatShare = (value: number, total: number) => {
  if (total <= 0) return "0%";
  const share = (value / total) * 100;
  return share > 0 && share < 1 ? "<1%" : `${Math.round(share)}%`;
};

const toChartItems = (items: PerformanceItem[]): ChartItem[] => {
  const seen = new Map<string, number>();

  return items.map((item) => {
    const spoilId = item.spoil_id ?? item.id ?? null;
    const occurrence = (seen.get(item.title) ?? 0) + 1;
    seen.set(item.title, occurrence);

    return {
      key: spoilId != null ? `id:${spoilId}` : `${item.title}#${occurrence}`,
      title: item.title,
      value: toAmount(item.total),
      spoilId,
    };
  });
};

// Colours follow the Spoylz, not its place in one chart: a Spoylz has the same
// colour in every chart, handed out biggest enrolment first.
export const assignSeries = (performance: SpoilPerformanceData): Series[] => {
  const charts = [
    performance.learners_enrolled,
    performance.revenue_generated,
    performance.completed_learners,
    performance.ongoing_learners,
    performance.not_started_learners,
  ].map(toChartItems);
  const enrolled = new Map(charts[0].map((item) => [item.key, item.value]));

  const spoils = new Map<string, ChartItem>();
  charts.flat().forEach((item) => {
    if (!spoils.has(item.key)) spoils.set(item.key, item);
  });

  const ranked = [...spoils.values()].sort(
    (a, b) => (enrolled.get(b.key) ?? 0) - (enrolled.get(a.key) ?? 0),
  );
  const colored = ranked.length <= MAX_SLICES ? ranked : ranked.slice(0, MAX_SLICES - 1);

  return colored.map(({ key, title, spoilId }, index) => ({
    key,
    title,
    spoilId,
    color: SERIES_COLORS[index],
  }));
};

export const toSlices = (items: PerformanceItem[], series: Series[]): Slice[] => {
  const chartItems = toChartItems(items);
  const valueOf = new Map(chartItems.map((item) => [item.key, item.value]));
  const colored = new Set(series.map((item) => item.key));

  const slices: Slice[] = series.map((item) => ({
    ...item,
    label: item.title,
    value: valueOf.get(item.key) ?? 0,
  }));

  const members = chartItems.filter((item) => !colored.has(item.key));
  if (members.length > 0) {
    slices.push({
      key: OTHER_KEY,
      title: "Other",
      label: `Other (${members.length} Spoylz)`,
      value: members.reduce((sum, item) => sum + item.value, 0),
      color: OTHER_COLOR,
      spoilId: null,
      members,
    });
  }

  return slices;
};
