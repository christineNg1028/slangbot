import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const HandleAppMentionFunction = DefineFunction({
  callback_id: "handle_app_mention_function",
  title: "Handle App Mention",
  description: "Responds to app mentions with slang definitions",
  source_file: "functions/handle_app_mention.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      text: {
        type: Schema.types.string,
        description: "The full text of the app mention",
      },
    },
    required: ["channel", "text"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

async function getDefinition(term: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
        term
      )}`
    );
    const data = await response.json();
    if (data.list && data.list.length > 0) {
      return data.list[0].definition;
    }
    return null;
  } catch (error) {
    console.error("Error fetching definition:", error);
    return null;
  }
}

export default SlackFunction(
  HandleAppMentionFunction,
  async ({ inputs, client }) => {
    console.log("Function triggered with inputs:", inputs);

    // Extract the term from the mention
    const match = inputs.text.match(/<@[A-Z0-9]+>\s+(.*)/);
    const term = match ? match[1].trim() : null;

    if (!term) {
      console.error("No term provided");
      return {
        error:
          "No term provided. Please mention the bot followed by a term to define.",
      };
    }

    const definition = await getDefinition(term);

    if (!definition) {
      console.error("Failed to get slang definition");
      return { error: `Sorry, I couldn't find a definition for "${term}".` };
    }

    try {
      const message = await client.chat.postMessage({
        channel: inputs.channel,
        text: `Definition of "${term}": ${definition}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Definition of "${term}":*\n${definition}`,
            },
          },
        ],
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
