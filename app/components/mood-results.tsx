import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { MoodAnalysis } from "~/utils/mood-analysis";

interface MoodResultsProps {
  analysis: MoodAnalysis;
}

export function MoodResults({ analysis }: MoodResultsProps) {
  const chartConfig = {
    intensity: {
      label: "Intensity",
    },
  };

  const colors = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
  ];

  const barData = analysis.moods.map((mood, index) => ({
    mood: mood.mood,
    intensity: mood.intensity,
    fill: colors[index % colors.length],
  }));

  const pieData = analysis.moods.map((mood, index) => ({
    name: mood.mood,
    value: mood.intensity,
    fill: colors[index % colors.length],
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold mb-4 text-foreground">
          {analysis.title}
        </h3>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          {analysis.description}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2">
          <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-md h-full">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Your Mood Spectrum</CardTitle>
              <CardDescription>
                Visual breakdown of your emotional state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-0 p-4">
              <div>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="mood"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        fontSize={12}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mood Intensities</CardTitle>
              <CardDescription>
                Intensity levels of detected moods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.moods.map((mood, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{mood.mood}</span>
                    <span className="text-muted-foreground">
                      {mood.intensity}/10
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(mood.intensity / 10) * 100}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl">Suggestions</CardTitle>
              <CardDescription>
                Practical steps to improve your mood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {suggestion}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
