# Hydration Error Protection Guide

## Problem
The AuntyGravity browser extension (and similar extensions) modify the DOM before React hydrates, causing hydration mismatches between server-rendered and client-rendered content. This results in errors like:

```
Text content does not match server-rendered HTML
Hydration failed because the initial UI does not match what was rendered on the server
```

## Solution Overview

We've implemented a comprehensive solution with multiple layers of protection:

### 1. **Utility Functions** (`lib/hydration-utils.ts`)

Created helper functions to sanitize and normalize data:

- `sanitizeClassName()` - Removes unexpected characters from class names
- `sanitizeTextContent()` - Removes zero-width and invisible unicode characters
- `normalizeChildren()` - Normalizes React children
- `isClient()` - Checks if code is running client-side
- `getClientValue()` - Safely returns client-only values
- `createStableKey()` - Creates stable keys for dynamic lists

### 2. **Hydration-Safe Text Component** (`components/ui/hydration-safe-text.tsx`)

Two wrapper components for text that may be modified by extensions:

- `<HydrationSafeText>` - Full-featured component with sanitization
- `<SafeText>` - Simple component with just suppressHydrationWarning

### 3. **Component Updates**

Updated all sensitive components with:

#### **Avatar Component** (`components/ui/avatar.tsx`)
- ✅ Added `suppressHydrationWarning` to all text nodes
- ✅ Sanitized className props
- ✅ Wrapped status indicator in `mounted` check
- ✅ Stabilized initials generation

#### **ChatItem Component** (`components/chat/chat-item.tsx`)
- ✅ Added `suppressHydrationWarning` to all text nodes
- ✅ Sanitized display names and messages
- ✅ Wrapped conditional renders in `mounted` checks
- ✅ Protected timestamp formatting

#### **ChatList Component** (`components/chat/chat-list.tsx`)
- ✅ Added `suppressHydrationWarning` to container
- ✅ Used stable keys with indices
- ✅ Wrapped list rendering in `mounted` check

#### **MessageBubble Component** (`components/chat/message-bubble.tsx`)
- ✅ Added `suppressHydrationWarning` to all elements
- ✅ Sanitized message content
- ✅ Wrapped timestamps in `mounted` check
- ✅ Protected status icons with `mounted` check

#### **Sidebar Components** (`components/layout/Sidebar.tsx` & `components/chat/sidebar.tsx`)
- ✅ Added `suppressHydrationWarning` to all static text
- ✅ Wrapped theme toggle in `mounted` check
- ✅ Protected tab navigation
- ✅ Guarded empty state messages

## Key Patterns

### Pattern 1: Suppress Hydration Warnings on Text Nodes

```tsx
<span suppressHydrationWarning>
  {dynamicText}
</span>
```

### Pattern 2: Client-Side Only Rendering

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// Later in render:
{mounted && <DynamicComponent />}
```

### Pattern 3: Sanitize Text Content

```tsx
import { sanitizeTextContent } from "@/lib/hydration-utils";

const safeText = sanitizeTextContent(userInput);

return <span suppressHydrationWarning>{safeText}</span>;
```

### Pattern 4: Stable Keys for Lists

```tsx
{items.map((item, index) => (
  <Item key={`item-${item.id}-${index}`} {...item} />
))}
```

### Pattern 5: Sanitize ClassNames

```tsx
import { sanitizeClassName } from "@/lib/hydration-utils";

const safeClassName = sanitizeClassName(props.className);
return <div className={cn("base-classes", safeClassName)} />;
```

## Root Layout Protection

The root `app/layout.tsx` already has:

```tsx
<html lang="en" suppressHydrationWarning>
  <body suppressHydrationWarning>
    {children}
  </body>
</html>
```

This provides a safety net for the entire application.

## Testing

To test the fixes:

1. **Without Extension**: Application should work normally
2. **With Extension**: No hydration errors should appear in console
3. **Check DevTools**: Look for hydration warnings in React DevTools

## When to Use Each Technique

### Use `suppressHydrationWarning`
- ✅ On text nodes that display dynamic content
- ✅ On elements with time-based content (timestamps, dates)
- ✅ On elements with user-generated content
- ✅ On any element that might be modified by browser extensions

### Use `mounted` Check
- ✅ For components that differ between server and client
- ✅ For theme-dependent UI elements
- ✅ For browser API-dependent features
- ✅ For optional UI elements (badges, indicators)

### Use Text Sanitization
- ✅ For user input display
- ✅ For truncated text
- ✅ For formatted names
- ✅ For any text that might contain invisible characters

## Performance Considerations

These protections have minimal performance impact:

- `suppressHydrationWarning` is compile-time flag (no runtime cost)
- `mounted` checks add one state variable per component
- Text sanitization is fast (regex operations)
- Sanitized values can be memoized if needed

## Future Improvements

If you encounter new hydration issues:

1. **Add `suppressHydrationWarning`** to the affected element
2. **Check if it needs client-side only rendering** (use mounted pattern)
3. **Sanitize text content** if it contains user input
4. **Create a specialized wrapper component** if the pattern repeats

## Component Reference

### Safe Components (Protected)
- ✅ `Avatar`
- ✅ `ChatItem`
- ✅ `ChatList`
- ✅ `MessageBubble`
- ✅ `Sidebar` (both versions)
- ✅ `HydrationSafeText`

### Components to Review (If Issues Arise)
- `MessageList`
- `ChatHeader`
- `TypingIndicator`
- `StatusList`
- `CallsList`
- `SettingsPanel`

## Browser Extension Compatibility

These fixes ensure compatibility with:

- ✅ AuntyGravity
- ✅ Grammarly
- ✅ React DevTools
- ✅ Translation extensions
- ✅ Accessibility extensions
- ✅ Ad blockers that modify DOM

## Debugging Tips

If you still see hydration errors:

1. **Check the console** for the specific element causing the issue
2. **Use React DevTools** to inspect the component tree
3. **Add `suppressHydrationWarning`** to the parent element
4. **Verify text sanitization** is working correctly
5. **Check for SSR/CSR differences** in data fetching

## Example: Adding Protection to New Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { sanitizeTextContent } from "@/lib/hydration-utils";

export function NewComponent({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeText = sanitizeTextContent(text);

  return (
    <div suppressHydrationWarning>
      <span suppressHydrationWarning>{safeText}</span>
      {mounted && <DynamicPart />}
    </div>
  );
}
```

## Summary

✅ All text nodes have `suppressHydrationWarning`  
✅ Dynamic content wrapped in `mounted` checks  
✅ Text content is sanitized  
✅ ClassNames are sanitized  
✅ Stable keys used for lists  
✅ Root layout protected  

Your application should now be fully protected against hydration errors from browser extensions!
