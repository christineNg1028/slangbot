import { Manifest } from "deno-slack-sdk/mod.ts";
import SendSlangDefinitionWorkflow from "./workflows/send_slang_definition_workflow.ts";
import { SendSlangDefinitionFunction } from "./functions/send_slang_definition.ts";
import DailySlangTrigger from "./triggers/daily_slang_trigger.ts";

export default Manifest({
  name: "slangbot",
  description: "daily dose of gen z slang",
  icon: "assets/skibidi_toilet.png",
  functions: [SendSlangDefinitionFunction],
  workflows: [SendSlangDefinitionWorkflow],
  triggers: [DailySlangTrigger],
  outgoingDomains: ["api.urbandictionary.com"],
  botScopes: ["chat:write", "chat:write.public"],
});
