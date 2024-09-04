import { fetchRandomSlang } from "./fetchRandomSlang.ts";

const MAX_DEFINITIONS = 2;
const MAX_RETRIES = 3;

export async function getDefinition(): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const slangTerm = fetchRandomSlang();
      const apiUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
        slangTerm
      )}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.list && data.list.length > 0) {
        const definitions = data.list
          .slice(0, MAX_DEFINITIONS)
          .map(
            (item, index) =>
              `${
                data.list.length > 1 ? index + 1 + "." : ""
              } ${sanitizeDefinition(item.definition)}`
          )
          .join("\n");
        return `*${slangTerm}*\n${definitions}`;
      } else {
        console.log(`No definition found for "${slangTerm}". Retrying...`);
        // Continue to the next iteration of the loop to try again
        continue;
      }
    } catch (error) {
      console.error("Error in getDefinition:", error);
      if (attempt === MAX_RETRIES - 1) {
        return `Failed to fetch definition after ${MAX_RETRIES} attempts. Error: ${error.message}`;
      }
      // Continue to the next iteration of the loop to try again
    }
  }

  return "Unable to find a definition after multiple attempts.";
}

const sanitizeDefinition = (definition: string): string => {
  return definition.replace(/[\[\]]/g, "");
};
