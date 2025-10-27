# Auto-Save Indicator Usage

## Quick Start

Add the `AutoSaveIndicator` component to any page where you want users to see save status:

```tsx
import { AutoSaveIndicator } from "@/components/auto-save-indicator";

export default function MyPage() {
  return (
    <div className="container">
      {/* Add to header or footer */}
      <div className="flex justify-between items-center mb-4">
        <h1>My Page</h1>
        <AutoSaveIndicator />
      </div>

      {/* Your page content */}
    </div>
  );
}
```

## Example Placements

### 1. In Navigation Bar

```tsx
// components/navigation.tsx
<nav className="flex justify-between">
  <Logo />
  <div className="flex items-center gap-4">
    <AutoSaveIndicator />
    <UserMenu />
  </div>
</nav>
```

### 2. In Page Footer

```tsx
<footer className="fixed bottom-4 right-4">
  <AutoSaveIndicator />
</footer>
```

### 3. In Card Header

```tsx
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <CardTitle>Settings</CardTitle>
      <AutoSaveIndicator />
    </div>
  </CardHeader>
</Card>
```

## How It Works

The indicator automatically shows:

- 🔵 **Cloud icon + "Saving..."** - When changes are queued (immediate)
- ✅ **Check icon + "All changes saved"** - After successful Firebase write (after 3s)
- Nothing shown when idle

No manual triggering needed - it listens to events from the auth context!

## Styling

Customize appearance with className:

```tsx
<AutoSaveIndicator className="text-sm" />
<AutoSaveIndicator className="fixed top-4 right-4" />
<AutoSaveIndicator className="opacity-50" />
```

## Optional: Add to Dreamland

```tsx
// app/dreamland/page.tsx
import { AutoSaveIndicator } from "@/components/auto-save-indicator";

// Add near top of page
<div className="flex justify-between items-center mb-6">
  <h1>Career Explorer</h1>
  <AutoSaveIndicator />
</div>;
```
