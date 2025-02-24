To implement the new modes—Conversational Mode and Brainlift Mode—into your existing project, you'll need to extend both the frontend and backend components. Here's a comprehensive step-by-step plan:

### Step 1: Define Mode Selection in the UI

1. **Update `ResearchForm.tsx`:**
   - Add a new field for mode selection using a toggle or dropdown.
   - Update the form schema to include a `mode` field.

```typescript
const formSchema = z.object({
  query: z.string().min(1, "Please enter a research query"),
  breadth: z.number().min(1).max(5),
  depth: z.number().min(1).max(3),
  mode: z.enum(['summary', 'conversational', 'brainlift']),
});

const defaultValues: FormValues = {
  query: "",
  breadth: 1,
  depth: 1,
  mode: 'summary',
};
```

2. **UI Component for Mode Selection:**
   - Add a UI component (e.g., a toggle group) to allow users to select the mode.

```typescript
<FormField
  control={form.control}
  name="mode"
  render={({ field }) => (
    <FormItem className="space-y-1.5">
      <FormLabel>Mode</FormLabel>
      <FormControl>
        <ToggleGroup
          type="single"
          value={field.value}
          onValueChange={field.onChange}
          className="flex gap-1"
        >
          {['summary', 'conversational', 'brainlift'].map((mode) => (
            <ToggleGroupItem
              key={mode}
              value={mode}
              className="h-8 w-8 rounded-md"
              aria-label={`Mode ${mode}`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FormControl>
    </FormItem>
  )}
/>
```

### Step 2: Backend Logic for Mode Handling

1. **Update `run.ts`:**
   - Modify the `run` function to handle different modes based on user input.
   - Implement logic to switch between modes.

```typescript
async function run() {
  // Get initial query and mode
  const initialQuery = await askQuestion('What would you like to research? ');
  const mode = await askQuestion('Select mode (summary, conversational, brainlift): ');

  // Handle different modes
  switch (mode) {
    case 'summary':
      // Existing summary logic
      break;
    case 'conversational':
      await handleConversationalMode(initialQuery);
      break;
    case 'brainlift':
      await handleBrainliftMode(initialQuery);
      break;
    default:
      console.log('Invalid mode selected.');
  }
}
```

2. **Implement Mode-Specific Functions:**
   - **Conversational Mode:** Implement `handleConversationalMode` to maintain a dialogue with the user, integrating background research as needed.
   - **Brainlift Mode:** Implement `handleBrainliftMode` to generate and evaluate questions for the user, providing feedback and resources.

### Step 3: Extend Backend Research Logic

1. **Update `deep-research.ts`:**
   - Modify the `deepResearch` function to support different research strategies based on the mode.
   - For Conversational Mode, integrate real-time feedback and dynamic query adjustments.
   - For Brainlift Mode, focus on generating questions and evaluating user responses.

2. **Add New Functions:**
   - Implement functions to generate questions and evaluate answers for Brainlift Mode.
   - Use existing AI models or integrate new ones if needed for question generation and evaluation.

### Step 4: Update Frontend Components

1. **Update `ResearchResults.tsx`:**
   - Modify the component to display results differently based on the mode.
   - For Conversational Mode, show ongoing dialogue and insights.
   - For Brainlift Mode, display questions, user answers, and feedback.

2. **Create New Components if Necessary:**
   - If the existing components cannot be easily adapted, create new components for displaying results specific to each mode.

### Step 5: API and Backend Integration

1. **Update API Endpoints:**
   - Modify existing API endpoints to accept the `mode` parameter and handle requests accordingly.
   - Ensure that the backend logic is capable of processing requests for each mode.

2. **Integrate New Technologies:**
   - If necessary, integrate new libraries or services for real-time communication (e.g., WebSockets) to support Conversational Mode.
   - Consider using additional AI models or services for question generation and evaluation in Brainlift Mode.

### Step 6: Testing and Validation

1. **Unit and Integration Testing:**
   - Write tests for new functions and components to ensure they work as expected.
   - Test the entire flow for each mode to validate the user experience and functionality.

2. **User Feedback and Iteration:**
   - Gather user feedback on the new modes and iterate on the design and implementation to improve usability and effectiveness.

By following these steps, you can effectively integrate the new Conversational and Brainlift modes into your existing project, providing users with a richer and more versatile research experience.
