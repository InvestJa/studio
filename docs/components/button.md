# Button Component

## Overview
A versatile button component that provides consistent styling and behavior across the InvestJá application. Built on top of Radix UI's Slot component for maximum flexibility.

## Component Purpose
- **Primary**: Trigger actions and navigation throughout the application
- **Secondary**: Form submissions, modal actions, and interactive elements
- **When NOT to use**: For navigation links (use Link component instead), or purely decorative elements

## Props/Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | No | 'default' | Visual style variant |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | No | 'default' | Button size |
| asChild | boolean | No | false | Render as child element (for composition) |
| disabled | boolean | No | false | Disable button interaction |
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Button content |
| onClick | function | No | - | Click event handler |
| type | `'button' \| 'submit' \| 'reset'` | No | 'button' | HTML button type |

## Usage Examples

### Basic Usage
```tsx
import { Button } from '@/components/ui/button'

<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>
```

### Variants
```tsx
// Primary action button
<Button variant="default">Save Changes</Button>

// Destructive action
<Button variant="destructive">Delete Client</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Ghost button for subtle actions
<Button variant="ghost">Edit</Button>

// Link-style button
<Button variant="link">Learn More</Button>
```

### Sizes
```tsx
// Small button
<Button size="sm">Small Action</Button>

// Large button
<Button size="lg">Primary CTA</Button>

// Icon-only button
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>
```

### With Icons
```tsx
import { PlusCircle, Trash2 } from 'lucide-react'

// Icon with text
<Button>
  <PlusCircle className="mr-2 h-4 w-4" />
  Add Client
</Button>

// Icon only
<Button size="icon" variant="outline">
  <Trash2 className="h-4 w-4" />
</Button>
```

### Form Integration
```tsx
// Submit button
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save Client'}
</Button>

// Reset button
<Button type="reset" variant="outline">
  Reset Form
</Button>
```

### Loading State
```tsx
import { Loader2 } from 'lucide-react'

<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

### As Child (Composition)
```tsx
import Link from 'next/link'

<Button asChild>
  <Link href="/clients">View Clients</Link>
</Button>
```

## Accessibility Considerations

### ARIA Support
- Automatically includes `role="button"` when not using native button
- Supports `aria-disabled` when disabled
- Inherits focus management from underlying element

### Keyboard Navigation
- **Space/Enter**: Activates the button
- **Tab**: Moves focus to/from button
- **Disabled state**: Removes from tab order

### Screen Reader Support
- Button text is announced by screen readers
- Loading states should include `aria-label` for context
- Icon-only buttons require `aria-label` or `title`

### Focus Management
```tsx
// Icon button with proper labeling
<Button size="icon" aria-label="Delete client">
  <Trash2 className="h-4 w-4" />
</Button>

// Loading button with context
<Button 
  disabled={isLoading}
  aria-label={isLoading ? 'Saving client data' : 'Save client'}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### Color Contrast
- All variants meet WCAG AA contrast requirements
- Focus indicators are clearly visible
- Disabled state maintains sufficient contrast for recognition

## Edge Cases & Error Handling

### Invalid Props
```tsx
// Gracefully handles invalid variant
<Button variant="invalid">Fallback to default</Button>

// Handles missing onClick for interactive buttons
<Button>Still renders but logs warning</Button>
```

### Loading States
```tsx
// Prevent double-clicks during async operations
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    await submitData()
  } finally {
    setIsSubmitting(false)
  }
}

<Button onClick={handleSubmit} disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### Error States
```tsx
// Show error state with retry option
<Button 
  variant={hasError ? 'destructive' : 'default'}
  onClick={hasError ? handleRetry : handleSubmit}
>
  {hasError ? 'Retry' : 'Submit'}
</Button>
```

### Empty/No Content
```tsx
// Button with no children renders but may not be useful
<Button></Button> // Renders empty button

// Better approach
<Button aria-label="Action">
  <IconComponent />
</Button>
```

## Styling & Theming

### CSS Variables Used
```css
--primary: Primary button background
--primary-foreground: Primary button text
--destructive: Destructive action color
--border: Border color for outline variant
--background: Background for secondary variant
```

### Custom Styling
```tsx
// Additional classes
<Button className="w-full justify-start">
  Custom Styled Button
</Button>

// Responsive sizing
<Button className="text-sm md:text-base lg:text-lg">
  Responsive Text
</Button>
```

### Variant Combinations
```tsx
// Combining variants with custom styles
<Button 
  variant="outline" 
  size="sm" 
  className="border-dashed hover:border-solid"
>
  Dashed Border
</Button>
```

## Dependencies

### External Libraries
- `@radix-ui/react-slot`: For composition pattern
- `class-variance-authority`: For variant management
- `lucide-react`: For icons (in examples)

### Internal Dependencies
- `@/lib/utils`: For className merging utility
- Theme system: Inherits from global CSS variables

### Required Context
- Theme provider for dark/light mode support
- No other required context providers

## Testing Considerations

### Key Test Scenarios
```tsx
// Basic rendering
test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})

// Click handling
test('calls onClick when clicked', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

// Disabled state
test('does not call onClick when disabled', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick} disabled>Click</Button>)
  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).not.toHaveBeenCalled()
})
```

### Accessibility Testing
```tsx
// Screen reader testing
test('has accessible name', () => {
  render(<Button aria-label="Save document">💾</Button>)
  expect(screen.getByLabelText('Save document')).toBeInTheDocument()
})

// Keyboard navigation
test('responds to keyboard events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
  expect(handleClick).toHaveBeenCalled()
})
```

### Visual Regression Testing
- Test all variants in light/dark themes
- Test all sizes with different content lengths
- Test focus states and hover effects
- Test disabled states across variants

## Migration Guide

### From v1 to v2
No breaking changes in current version.

### Deprecated Features
None currently.

## Related Components

### Similar Components
- `Link`: For navigation actions
- `IconButton`: Specialized icon-only button (if exists)

### Complementary Components
- `Form`: Often used within forms
- `Dialog`: Common in modal actions
- `DropdownMenu`: Used in dropdown triggers

### Parent/Child Relationships
- Can be used within: `Form`, `Dialog`, `Card`, `Toolbar`
- Can contain: Icons, text, loading spinners

## Examples in Codebase

### File Locations
- `src/components/clients/add-client-dialog.tsx`: Form submission buttons
- `src/components/clients/client-actions.tsx`: Action menu triggers
- `src/components/layout/app-header.tsx`: Navigation and user actions
- `src/components/payments/add-payment-dialog.tsx`: Payment form actions

### Real-world Implementation
```tsx
// From add-client-dialog.tsx
<div className="flex justify-end space-x-3 pt-6">
  <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
    Cancelar
  </Button>
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
    {initialData ? "Salvar Alterações" : "Adicionar Cliente"}
  </Button>
</div>

// From client-actions.tsx
<DropdownMenuTrigger asChild>
  <Button variant="ghost" className="h-8 w-8 p-0">
    <span className="sr-only">Abrir menu</span>
    <Icons.moreHorizontal className="h-4 w-4" />
  </Button>
</DropdownMenuTrigger>
```

## Performance Considerations

### Bundle Size
- Lightweight component (~2KB gzipped)
- Tree-shakeable variants
- No heavy dependencies

### Runtime Performance
- Minimal re-renders with proper memoization
- Efficient className computation
- No performance bottlenecks identified

### Best Practices
- Use `asChild` for composition instead of wrapper divs
- Memoize click handlers in parent components
- Use appropriate button types for forms