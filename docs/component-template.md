# Component Documentation Template

This template provides a standardized format for documenting all reusable components in the InvestJá project.

## Template Structure

```markdown
# ComponentName

## Overview
Brief description of what the component does and when to use it.

## Component Purpose
- Primary use case
- Secondary use cases
- When NOT to use this component

## Props/Parameters
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| propName | string | Yes | - | Description of the prop |
| optionalProp | boolean | No | false | Description with default |

## Usage Examples

### Basic Usage
```tsx
<ComponentName prop="value" />
```

### Advanced Usage
```tsx
<ComponentName 
  prop="value"
  optionalProp={true}
  onAction={handleAction}
>
  Content here
</ComponentName>
```

### With State Management
```tsx
const [state, setState] = useState(false)
<ComponentName 
  controlled={state}
  onChange={setState}
/>
```

## Accessibility Considerations
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast requirements

## Edge Cases & Error Handling
- What happens with invalid props
- Loading states
- Error states
- Empty states
- Boundary conditions

## Styling & Theming
- Available variants
- Custom styling options
- Theme integration
- Responsive behavior

## Dependencies
- External libraries used
- Internal component dependencies
- Required context providers

## Testing Considerations
- Key test scenarios
- Accessibility testing
- Visual regression testing
- Performance considerations

## Migration Guide (if applicable)
- Breaking changes from previous versions
- Migration steps
- Deprecated features

## Related Components
- Similar components
- Complementary components
- Parent/child relationships

## Examples in Codebase
- File locations where component is used
- Real-world implementation examples
```

## Documentation Standards

### Writing Guidelines
1. **Be Concise**: Clear and direct explanations
2. **Use Examples**: Show, don't just tell
3. **Include Edge Cases**: Document failure scenarios
4. **Keep Updated**: Update docs with code changes
5. **Be Consistent**: Follow the same format for all components

### Code Examples
- Use TypeScript for all examples
- Include proper imports
- Show realistic use cases
- Include error handling where relevant

### Accessibility Requirements
- Document ARIA attributes
- Explain keyboard interactions
- Note screen reader behavior
- Include color contrast information

### Version Control
- Update documentation with component changes
- Use semantic versioning for breaking changes
- Maintain changelog for component updates