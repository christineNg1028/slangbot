import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { getDefinition } from "./utils/getDefinition.ts";

/**
 * This custom function will pull the stored message from the datastore
 * and send it to the joining user as an ephemeral message in the
 * specified channel.
 */
export const SendSlangDefinitionFunction = DefineFunction({
  callback_id: "send_slang_definition_function",
  title: "Send slang definition",
  description: "Pull the slang definition and send it to the channel",
  source_file: "functions/send_slang_definition.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel where the message will be sent",
      },
    },
    required: ["channel"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  SendSlangDefinitionFunction,
  async ({ inputs, client }) => {
    console.log("Function triggered with inputs:", inputs);

    const definition = await getDefinition();
    console.log("Retrieved definition:", definition);

    if (!definition) {
      console.error("Failed to get slang definition");
      return { error: "Failed to get slang definition" };
    }

    try {
      const message = await client.chat.postMessage({
        channel: inputs.channel,
        text: definition,
      });

      if (!message.ok) {
        console.error("Failed to send message:", message.error);
        return { error: `Failed to send slang definition: ${message.error}` };
      }

      console.log("Message sent successfully");
      return { outputs: {} };
    } catch (error) {
      console.error("Error sending message:", error);
      return { error: `Error sending message: ${error.message}` };
    }
  }
);
