import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import AppMentionWorkflow from "../workflows/app_mention_workflow.ts";

const AppMentionTrigger: Trigger<typeof AppMentionWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "App Mention Trigger",
  description: "Trigger for app_mention events",
  workflow: "#/workflows/app_mention_workflow",
  event: {
    event_type: "slack#/events/app_mention",
  },
  inputs: {
    channel: {
      value: "{{event.channel}}",
    },
    text: {
      value: "{{event.text}}",
    },
  },
};

export default AppMentionTrigger;
