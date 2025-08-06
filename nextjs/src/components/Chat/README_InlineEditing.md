# Inline Editable Chat Response Component

This component provides inline editing functionality for chat responses in your Next.js application.

## Features

- **Click to Edit**: Click on any part of the response to start editing
- **Keyboard Shortcuts**: 
  - `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows/Linux) to save
  - `Esc` to cancel
- **Markdown Support**: Renders markdown content with proper formatting
- **Auto-resizing**: Textarea automatically adjusts height based on content
- **Visual Feedback**: Hover states and visual indicators for editing mode
- **Clean UI**: Modern design with Tailwind CSS

## Components

### 1. InlineEditableResponse (Advanced)
- Splits response into individual paragraphs
- Allows editing each paragraph separately
- More granular control over content

### 2. InlineEditableChatResponse (Simple)
- Edits the entire response as one unit
- Simpler implementation
- Better for shorter responses

## Usage Examples

### Basic Usage

```tsx
import InlineEditableChatResponse from '@/components/Chat/InlineEditableChatResponse';

const MyComponent = () => {
  const [response, setResponse] = useState("Your chat response here");

  const handleSave = (updatedResponse: string) => {
    setResponse(updatedResponse);
    // Make API call to save updated response
    console.log('Updated response:', updatedResponse);
  };

  const handleCancel = () => {
    console.log('Edit cancelled');
  };

  return (
    <InlineEditableChatResponse
      response={response}
      onSave={handleSave}
      onCancel={handleCancel}
      className="my-custom-class"
    />
  );
};
```

### Advanced Usage (Paragraph-by-Paragraph)

```tsx
import InlineEditableResponse from '@/components/Chat/InlineEditableResponse';

const MyComponent = () => {
  const [response, setResponse] = useState("Paragraph 1\n\nParagraph 2\n\nParagraph 3");

  const handleSave = (updatedResponse: string) => {
    setResponse(updatedResponse);
    // Make API call to save updated response
  };

  return (
    <InlineEditableResponse
      response={response}
      onSave={handleSave}
      onCancel={() => console.log('Cancelled')}
    />
  );
};
```

### Integration with Existing ChatResponse

To integrate with your existing `ChatResponse` component, you can replace the `MarkOutPut` call:

```tsx
// In ChatResponse.tsx, replace:
{MarkOutPut(m.response)}

// With:
<InlineEditableChatResponse
  response={m.response}
  onSave={(updatedResponse) => {
    // Handle saving the updated response
    console.log('Response updated:', updatedResponse);
  }}
  onCancel={() => {
    // Handle cancellation
  }}
/>
```

## Props

### InlineEditableChatResponse

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `response` | `string` | - | The chat response text to display and edit |
| `onSave` | `(updatedResponse: string) => void` | - | Callback when user saves changes |
| `onCancel` | `() => void` | - | Callback when user cancels editing |
| `disabled` | `boolean` | `false` | Disable editing functionality |
| `className` | `string` | `''` | Additional CSS classes |

### InlineEditableResponse

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `response` | `string` | - | The chat response text to display and edit |
| `onSave` | `(updatedResponse: string) => void` | - | Callback when user saves changes |
| `onCancel` | `() => void` | - | Callback when user cancels editing |
| `className` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable editing functionality |

## Styling

The components use Tailwind CSS classes and can be customized:

```tsx
<InlineEditableChatResponse
  response={response}
  onSave={handleSave}
  className="bg-white rounded-lg shadow-lg p-4"
/>
```

## Keyboard Shortcuts

- **Save**: `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows/Linux)
- **Cancel**: `Esc`

## Dependencies

- React 18+
- Tailwind CSS
- Your existing `TextAreaBox` component
- Your existing `MarkOutPut` function

## Notes

- The component preserves markdown formatting during editing
- Auto-resizing textarea provides better UX
- Visual feedback helps users understand the editing state
- The component is fully responsive and works on mobile devices 