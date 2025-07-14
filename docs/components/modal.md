# Modal (Dialog) Component

## Overview
A flexible modal dialog component built on Radix UI's Dialog primitive. Provides accessible, customizable modal windows for forms, confirmations, and content display throughout the InvestJá application.

## Component Purpose
- **Primary**: Display forms, detailed information, and user confirmations
- **Secondary**: Image galleries, help content, and complex interactions
- **When NOT to use**: For simple tooltips (use Tooltip), or permanent content (use Card)

## Props/Parameters

### Dialog (Root)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| open | boolean | No | false | Controlled open state |
| onOpenChange | function | No | - | Callback when open state changes |
| modal | boolean | No | true | Whether dialog is modal |

### DialogContent
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Modal content |
| onEscapeKeyDown | function | No | - | Escape key handler |
| onPointerDownOutside | function | No | - | Outside click handler |

### DialogHeader
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Header content |

### DialogTitle
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Title text |

### DialogDescription
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| className | string | No | - | Additional CSS classes |
| children | ReactNode | Yes | - | Description text |

## Usage Examples

### Basic Modal
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function BasicModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>
            This is a description of what this modal contains.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Modal content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Form Modal
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

function FormModal({ isOpen, onOpenChange, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' }
  })

  const handleSubmit = async (values) => {
    await onSubmit(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client details below to add them to your system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="client@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Client</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### Confirmation Modal
```tsx
function ConfirmationModal({ isOpen, onOpenChange, onConfirm, title, description, isDestructive = false }) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={isDestructive ? 'text-destructive' : ''}>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Usage
<ConfirmationModal
  isOpen={showDeleteModal}
  onOpenChange={setShowDeleteModal}
  onConfirm={() => deleteClient(clientId)}
  title="Delete Client"
  description="Are you sure you want to delete this client? This action cannot be undone."
  isDestructive={true}
/>
```

### Large Content Modal
```tsx
function LargeContentModal({ isOpen, onOpenChange, client }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Client Details: {client?.name}</DialogTitle>
          <DialogDescription>
            Complete information and history for this client.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-150px)] pr-5">
          <div className="space-y-6 py-4">
            {/* Large content here */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              {/* Content */}
            </section>
            <section>
              <h3 className="text-lg font-semibold mb-2">Loan Details</h3>
              {/* Content */}
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Controlled vs Uncontrolled
```tsx
// Controlled (recommended for complex state)
function ControlledModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Content */}
    </Dialog>
  )
}

// Uncontrolled (simpler for basic use)
function UncontrolledModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      {/* Content */}
    </Dialog>
  )
}
```

## Accessibility Considerations

### ARIA Support
- Automatically includes `role="dialog"`
- `aria-labelledby` points to DialogTitle
- `aria-describedby` points to DialogDescription
- `aria-modal="true"` for modal dialogs

### Keyboard Navigation
- **Escape**: Closes the modal
- **Tab**: Cycles through focusable elements within modal
- **Shift+Tab**: Reverse tab order
- **Enter/Space**: Activates focused element

### Focus Management
```tsx
// Focus is automatically trapped within modal
// First focusable element receives focus on open
// Focus returns to trigger on close

// Custom focus management
<DialogContent onOpenAutoFocus={(e) => {
  // Prevent default focus, focus specific element
  e.preventDefault()
  customElementRef.current?.focus()
}}>
```

### Screen Reader Support
- Modal content is announced when opened
- Background content is hidden from screen readers
- Proper heading hierarchy maintained

### Required Accessibility Props
```tsx
// Always include title and description
<DialogHeader>
  <DialogTitle>Required Title</DialogTitle>
  <DialogDescription>
    Required description for screen readers
  </DialogDescription>
</DialogHeader>
```

## Edge Cases & Error Handling

### Async Operations
```tsx
function AsyncModal({ isOpen, onOpenChange }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await submitData(data)
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Form content */}
        <DialogFooter>
          <Button 
            type="submit" 
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Prevent Accidental Closure
```tsx
function UnsavedChangesModal({ isOpen, onOpenChange, hasUnsavedChanges }) {
  const handleOpenChange = (open) => {
    if (!open && hasUnsavedChanges) {
      // Show confirmation before closing
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onOpenChange(false)
      }
    } else {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        onEscapeKeyDown={(e) => {
          if (hasUnsavedChanges) {
            e.preventDefault()
            handleOpenChange(false)
          }
        }}
        onPointerDownOutside={(e) => {
          if (hasUnsavedChanges) {
            e.preventDefault()
          }
        }}
      >
        {/* Content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Mobile Responsiveness
```tsx
// Responsive modal sizing
<DialogContent className="sm:max-w-[425px] mx-4 max-h-[90vh] overflow-y-auto">
  {/* Content that adapts to mobile screens */}
</DialogContent>

// Full-screen on mobile
<DialogContent className="sm:max-w-[600px] h-full sm:h-auto w-full sm:w-auto max-w-none sm:max-w-[600px] rounded-none sm:rounded-lg">
  {/* Full-screen mobile experience */}
</DialogContent>
```

## Styling & Theming

### CSS Variables Used
```css
--background: Modal background color
--foreground: Text color
--border: Border color
--muted: Muted text color
--destructive: Error/destructive action color
```

### Custom Styling
```tsx
// Custom modal sizes
<DialogContent className="sm:max-w-[800px]">Large Modal</DialogContent>
<DialogContent className="sm:max-w-[300px]">Small Modal</DialogContent>

// Custom positioning
<DialogContent className="top-[10%] translate-y-0">Top-positioned</DialogContent>

// Custom animations
<DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out">
  Custom Animation
</DialogContent>
```

### Dark Mode Support
- Automatically adapts to theme
- Uses CSS variables for consistent theming
- No additional configuration required

## Dependencies

### External Libraries
- `@radix-ui/react-dialog`: Core dialog functionality
- `@radix-ui/react-slot`: For composition pattern

### Internal Dependencies
- `@/lib/utils`: For className merging
- `@/components/ui/button`: For action buttons
- `@/components/ui/scroll-area`: For scrollable content

### Required Context
- No required context providers
- Works with theme provider for styling

## Testing Considerations

### Key Test Scenarios
```tsx
// Modal opening and closing
test('opens and closes modal', () => {
  render(<TestModal />)
  fireEvent.click(screen.getByText('Open Modal'))
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  
  fireEvent.click(screen.getByText('Close'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

// Escape key handling
test('closes on escape key', () => {
  render(<TestModal />)
  fireEvent.click(screen.getByText('Open Modal'))
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

// Focus management
test('traps focus within modal', () => {
  render(<TestModal />)
  fireEvent.click(screen.getByText('Open Modal'))
  
  const modal = screen.getByRole('dialog')
  const focusableElements = modal.querySelectorAll('button, input, select, textarea')
  
  // Test tab cycling
  focusableElements[0].focus()
  fireEvent.keyDown(document, { key: 'Tab' })
  expect(focusableElements[1]).toHaveFocus()
})
```

### Accessibility Testing
```tsx
// Screen reader announcements
test('announces modal content to screen readers', () => {
  render(<TestModal />)
  fireEvent.click(screen.getByText('Open Modal'))
  
  const modal = screen.getByRole('dialog')
  expect(modal).toHaveAttribute('aria-labelledby')
  expect(modal).toHaveAttribute('aria-describedby')
})

// Keyboard navigation
test('supports keyboard navigation', () => {
  render(<TestModal />)
  fireEvent.click(screen.getByText('Open Modal'))
  
  // Test all keyboard interactions
  fireEvent.keyDown(document, { key: 'Tab' })
  fireEvent.keyDown(document, { key: 'Enter' })
  fireEvent.keyDown(document, { key: 'Escape' })
})
```

## Migration Guide

### From v1 to v2
No breaking changes in current version.

### Deprecated Features
None currently.

## Related Components

### Similar Components
- `AlertDialog`: For confirmations and alerts
- `Popover`: For smaller, contextual content
- `Sheet`: For slide-out panels

### Complementary Components
- `Form`: Often used within modals
- `Button`: For modal actions
- `ScrollArea`: For scrollable modal content
- `Alert`: For error states within modals

### Parent/Child Relationships
- Can contain: Forms, tables, images, any content
- Often triggered by: Buttons, menu items, table actions

## Examples in Codebase

### File Locations
- `src/components/clients/add-client-dialog.tsx`: Client form modal
- `src/components/clients/view-client-dialog.tsx`: Client details modal
- `src/components/payments/add-payment-dialog.tsx`: Payment form modal
- `src/components/payments/view-payment-dialog.tsx`: Payment details modal

### Real-world Implementation
```tsx
// From add-client-dialog.tsx
export function AddClientDialog({ isOpen, onOpenChange, onSave, editingClient }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[750px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {editingClient 
              ? "Atualize as informações do cliente." 
              : "Preencha os dados abaixo para cadastrar um novo cliente."
            }
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
```

## Performance Considerations

### Bundle Size
- Moderate component (~8KB gzipped with Radix)
- Tree-shakeable parts
- Lazy load for better performance

### Runtime Performance
- Efficient focus management
- Minimal re-renders with proper state management
- Portal rendering for better performance

### Best Practices
- Use controlled state for complex modals
- Implement proper cleanup in useEffect
- Avoid heavy computations in modal content
- Use React.memo for modal content when appropriate