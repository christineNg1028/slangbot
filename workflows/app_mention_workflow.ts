import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { HandleAppMentionFunction } from "../functions/handle_app_mention.ts";

const AppMentionWorkflow = DefineWorkflow({
  callback_id: "app_mention_workflow",
  title: "App Mention Workflow",
  description: "Workflow triggered by app mentions",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      text: {
        type: Schema.types.string,
      },
    },
    required: ["channel", "text"],
  },
});

AppMentionWorkflow.addStep(HandleAppMentionFunction, {
  channel: AppMentionWorkflow.inputs.channel,
  text: AppMentionWorkflow.inputs.text,
});

export default AppMentionWorkflow;
