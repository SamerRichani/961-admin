export function simulateAIResponse(userInput: string): string {
  // Simple canned responses for demonstration
  if (/analytics/i.test(userInput)) return "Analytics are available in the Analytics section. You can view metrics, trends, and more.";
  if (/user/i.test(userInput)) return "User management tools are in the Users section. You can add, remove, or edit users.";
  if (/revenue|payment|finance/i.test(userInput)) return "Revenue and payment details are in the Finance section."
  if (/logistics|flex/i.test(userInput)) return "Logistics and Flex features are available in the Logistics section.";
  return "I'm here to help! Please specify your question about analytics, users, revenue, or admin tasks.";
} 