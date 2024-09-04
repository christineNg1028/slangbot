import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";

const DailySlangTrigger: Trigger<TriggerContextData> = {
  type: TriggerTypes.Scheduled,
  name: "Daily Slang Definition",
  description: "Sends slang definition every day",
  workflow: "#/workflows/send_slang_definition_workflow",
  inputs: {
    channel: {
      value: "C02CUTRR1BM",
    },
  },
  schedule: {
    start_time: new Date(Date.now() + 60000).toISOString(),
    frequency: {
      type: "daily",
      repeats_every: 1,
    },
  },
};

export default DailySlangTrigger;
