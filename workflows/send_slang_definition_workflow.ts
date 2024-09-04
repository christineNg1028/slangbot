import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SendSlangDefinitionFunction } from "../functions/send_slang_definition.ts";

const SendSlangDefinitionWorkflow = DefineWorkflow({
  callback_id: "send_slang_definition_workflow",
  title: "Send Slang Definition",
  description: "Sends a slang definition to a channel",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel"],
  },
});

SendSlangDefinitionWorkflow.addStep(SendSlangDefinitionFunction, {
  channel: SendSlangDefinitionWorkflow.inputs.channel,
});

export default SendSlangDefinitionWorkflow;
