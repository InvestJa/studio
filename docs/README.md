# Component Documentation

This directory contains comprehensive documentation for all reusable components in the InvestJá project.

## Documentation Structure

### 📁 Directory Layout
```
docs/
├── README.md                    # This file
├── component-template.md        # Template for documenting new components
└── components/
    ├── button.md               # Button component documentation
    ├── modal.md                # Modal/Dialog component documentation
    ├── form.md                 # Form components documentation
    ├── table.md                # Data table documentation
    └── ...                     # Additional component docs
```

## Quick Start

### For Developers
1. **Using Components**: Check the component docs for usage examples and props
2. **Creating Components**: Follow the template in `component-template.md`
3. **Contributing**: Update docs when modifying components

### For Designers
1. **Design System**: Component docs include styling and theming information
2. **Accessibility**: Each component documents accessibility requirements
3. **Variants**: All available component variants are documented with examples

## Component Categories

### 🎨 **UI Components**
- **Button** - Action triggers and navigation
- **Modal/Dialog** - Overlays and forms
- **Card** - Content containers
- **Badge** - Status indicators
- **Alert** - Notifications and messages

### 📝 **Form Components**
- **Input** - Text input fields
- **Select** - Dropdown selections
- **Checkbox** - Boolean inputs
- **Radio Group** - Single selection from options
- **Form** - Form wrapper with validation

### 📊 **Data Components**
- **Table** - Data tables with sorting/filtering
- **Chart** - Data visualization components
- **Pagination** - Data navigation
- **Search** - Data filtering

### 🧭 **Navigation Components**
- **Sidebar** - Main navigation
- **Breadcrumb** - Page hierarchy
- **Tabs** - Content organization
- **Menu** - Action menus

### 🔧 **Utility Components**
- **Loading** - Loading states
- **Error Boundary** - Error handling
- **Theme Provider** - Theme management
- **Toast** - Notifications

## Documentation Standards

### ✅ **What's Included**
- Component purpose and use cases
- Complete props/parameters reference
- Usage examples (basic to advanced)
- Accessibility considerations
- Edge cases and error handling
- Styling and theming options
- Testing guidelines
- Real codebase examples

### 📋 **Documentation Checklist**
When documenting a component, ensure you include:

- [ ] Clear component overview
- [ ] Complete props table
- [ ] Basic usage example
- [ ] Advanced usage examples
- [ ] Accessibility requirements
- [ ] Edge cases and error handling
- [ ] Styling customization options
- [ ] Dependencies and requirements
- [ ] Testing considerations
- [ ] Related components
- [ ] Real codebase examples

## Contributing to Documentation

### Adding New Component Documentation
1. Copy `component-template.md`
2. Rename to `components/your-component.md`
3. Fill in all sections with component-specific information
4. Include real examples from the codebase
5. Test all code examples
6. Update this README with the new component

### Updating Existing Documentation
1. Keep documentation in sync with code changes
2. Update examples when component APIs change
3. Add new usage patterns as they emerge
4. Maintain version history for breaking changes

### Documentation Review Process
1. **Technical Review**: Ensure accuracy of props and examples
2. **Accessibility Review**: Verify accessibility documentation
3. **Usage Review**: Confirm examples match real usage patterns
4. **Writing Review**: Check clarity and completeness

## Accessibility Standards

All components must meet:
- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management** requirements
- **Color contrast** standards

## Testing Documentation

Each component should document:
- **Unit tests** for functionality
- **Integration tests** for user interactions
- **Accessibility tests** for compliance
- **Visual regression tests** for UI consistency

## Design System Integration

Documentation includes:
- **Design tokens** usage
- **Theme integration** examples
- **Responsive behavior** guidelines
- **Brand consistency** requirements

## Tools and Resources

### Documentation Tools
- **Markdown**: All docs written in Markdown
- **Code Examples**: TypeScript/TSX examples
- **Screenshots**: Visual examples where helpful

### Development Tools
- **Storybook**: Interactive component playground (if implemented)
- **TypeScript**: Type definitions for all props
- **ESLint**: Code quality in examples

### Design Tools
- **Figma**: Design system components
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

## Getting Help

### For Component Usage
1. Check the specific component documentation
2. Look at real examples in the codebase
3. Review the component template for structure

### For Documentation Issues
1. Create an issue describing the problem
2. Suggest improvements or missing information
3. Contribute fixes via pull requests

### For New Components
1. Follow the component template
2. Include all required sections
3. Test all examples before submitting
4. Request review from team members

---

**Last Updated**: December 2024  
**Maintained By**: InvestJá Development Team  
**Version**: 1.0.0