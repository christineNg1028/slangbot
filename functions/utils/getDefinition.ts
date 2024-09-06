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
        const definitionPromises = data.list
          .slice(0, MAX_DEFINITIONS)
          .map(async (item, index) => {
            const sanitizedDefinition = await sanitizeText(item.definition);
            const sanitizedExample = await sanitizeText(item.example);
            return `${
              data.list.length > 1 ? index + 1 + "." : ""
            } ${sanitizedDefinition}\nExample: ${sanitizedExample}`;
          });

        const definitions = await Promise.all(definitionPromises);
        return `*${slangTerm}*\n${definitions.join("\n")}`;
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

async function sanitizeText(definition: string): Promise<string> {
  const apiKey = "/wF1OQuZuQPIv2PAWXmdZA==fm8Eaq0m0tIaChms";
  const apiUrl = `https://api.api-ninjas.com/v1/profanityfilter?text=${encodeURIComponent(
    definition
  )}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("data", data);
    if (data.has_profanity) {
      return data.censored.replace(/[\[\]]/g, "");
    } else {
      return definition.replace(/[\[\]]/g, "");
    }
  } catch (error) {
    console.error("Error in profanity filter:", error);
    // Fallback to original sanitization if API call fails
    return definition.replace(/[\[\]]/g, "");
  }
}
