import { Manifest } from "deno-slack-sdk/mod.ts";
import SendSlangDefinitionWorkflow from "./workflows/send_slang_definition_workflow.ts";
import { SendSlangDefinitionFunction } from "./functions/send_slang_definition.ts";
import DailySlangTrigger from "./triggers/daily_slang_trigger.ts";
import { HandleAppMentionFunction } from "./functions/handle_app_mention.ts";
import AppMentionWorkflow from "./workflows/app_mention_workflow.ts";
import AppMentionTrigger from "./triggers/app_mention_trigger.ts";

export default Manifest({
  name: "slangbot",
  description: "daily dose of gen z slang",
  icon: "assets/skibidi_toilet.png",
  functions: [SendSlangDefinitionFunction, HandleAppMentionFunction],
  workflows: [SendSlangDefinitionWorkflow, AppMentionWorkflow],
  triggers: [DailySlangTrigger, AppMentionTrigger],
  outgoingDomains: ["api.urbandictionary.com", "api.api-ninjas.com"],
  botScopes: ["chat:write", "chat:write.public", "app_mentions:read"],
});
