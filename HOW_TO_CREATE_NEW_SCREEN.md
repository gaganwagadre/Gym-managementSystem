# Step-by-Step Guide: Creating a New Screen

This guide shows you how to create a new screen in your Expo Router project using the centralized routes module.

## Example: Creating a "Notifications" Screen

---

## **Step 1: Add Route to `src/utils/routes.ts`**

### 1.1 Add Route Path Constant

In the `ROUTES` object, add your new route:

```typescript
export const ROUTES = {
  // ... existing routes ...
  
  // Main app routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',  // ← Add this
  MODAL: '/modal',
  
  // ... rest of routes ...
} as const;
```

### 1.2 Add Route Name

In the `ROUTE_NAMES` object, add the Expo Router screen name:

```typescript
export const ROUTE_NAMES = {
  // ... existing routes ...
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',  // ← Add this
  MODAL: 'modal',
  // ... rest of routes ...
} as const;
```

### 1.3 Add Route Configuration

In the `ROUTE_CONFIGS` object, add metadata for your route:

```typescript
export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  // ... existing configs ...
  REPORTS: {
    path: ROUTES.REPORTS,
    name: ROUTE_NAMES.REPORTS,
    title: 'Reports',
    requiresAuth: true,
  },
  NOTIFICATIONS: {  // ← Add this
    path: ROUTES.NOTIFICATIONS,
    name: ROUTE_NAMES.NOTIFICATIONS,
    title: 'Notifications',
    requiresAuth: true,  // Set to false if public
    // roles: ['admin'],  // Uncomment if role-restricted
  },
  // ... rest of configs ...
};
```

---

## **Step 2: Create the Screen File**

Create a new file in the `app` directory following Expo Router's file-based routing:

### For a simple screen:
- **File:** `app/notifications.tsx`
- **Route:** `/notifications`

### For nested screens:
- **File:** `app/notifications/index.tsx`
- **Route:** `/notifications`

### For dynamic routes:
- **File:** `app/notifications/[id].tsx`
- **Route:** `/notifications/:id`

### Example Screen Template:

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Header, Sidebar } from '../src/components';
import { ROUTES } from '../src/utils/routes';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header
        title="Notifications"
        showMenu
        onMenuPress={() => setSidebarVisible(true)}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Notifications</Text>
        {/* Add your screen content here */}
      </ScrollView>

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
});
```

---

## **Step 3: Register Screen in `app/_layout.tsx`**

Add your screen to the Stack navigator:

```typescript
<Stack
  screenOptions={{
    headerShown: false,
  }}
>
  {/* ... existing screens ... */}
  <Stack.Screen name="profile" />
  <Stack.Screen name="settings" />
  <Stack.Screen name="reports" />
  <Stack.Screen name="notifications" />  {/* ← Add this */}
  <Stack.Screen name="modal" />
</Stack>
```

**Note:** The `name` should match the `ROUTE_NAMES` value (e.g., `'notifications'`)

---

## **Step 4: Use the Route in Navigation**

Now you can navigate to your new screen from anywhere in the app:

### 4.1 Using router.push()

```typescript
import { useRouter } from 'expo-router';
import { ROUTES } from '../src/utils/routes';

function MyComponent() {
  const router = useRouter();
  
  return (
    <TouchableOpacity onPress={() => router.push(ROUTES.NOTIFICATIONS)}>
      <Text>Go to Notifications</Text>
    </TouchableOpacity>
  );
}
```

### 4.2 Using router.replace()

```typescript
router.replace(ROUTES.NOTIFICATIONS);
```

### 4.3 In Sidebar/Menu Items

If you want to add it to the sidebar menu, update `src/utils/staticData.ts`:

```typescript
menuItems: [
  // ... existing items ...
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications-outline',
    route: ROUTES.NOTIFICATIONS,
  },
],
```

---

## **Step 5: (Optional) Add to Bottom Navigation**

If you want to add it to the bottom navigation bar (like in dashboard.tsx):

```typescript
<View style={styles.bottomNav}>
  <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.DASHBOARD)}>
    <Ionicons name="home" size={24} color="#4A90E2" />
    <Text style={styles.navText}>Home</Text>
  </TouchableOpacity>
  
  {/* Add your new screen */}
  <TouchableOpacity style={styles.navItem} onPress={() => router.push(ROUTES.NOTIFICATIONS)}>
    <Ionicons name="notifications" size={24} color="#6C757D" />
    <Text style={styles.navText}>Notifications</Text>
  </TouchableOpacity>
  
  {/* ... other nav items ... */}
</View>
```

---

## **Quick Reference Checklist**

- [ ] ✅ Added route to `ROUTES` in `src/utils/routes.ts`
- [ ] ✅ Added route name to `ROUTE_NAMES` in `src/utils/routes.ts`
- [ ] ✅ Added route config to `ROUTE_CONFIGS` in `src/utils/routes.ts`
- [ ] ✅ Created screen file in `app/` directory
- [ ] ✅ Registered screen in `app/_layout.tsx`
- [ ] ✅ Imported `ROUTES` in components that navigate to it
- [ ] ✅ Used `ROUTES.NOTIFICATIONS` instead of hardcoded strings

---

## **Special Cases**

### Dynamic Routes (with parameters)

For routes like `/notifications/[id]`:

1. **In routes.ts:**
```typescript
NOTIFICATIONS_DETAIL: (id: string) => `/notifications/${id}`,
```

2. **Use navigation helper:**
```typescript
import { navigationHelpers } from '../src/utils/routes';

// In your component
router.push(navigationHelpers.getNotificationDetailRoute(notificationId));
```

Or create a custom helper:
```typescript
// In routes.ts navigationHelpers
getNotificationDetailRoute: (id: string): string => {
  return ROUTES.NOTIFICATIONS_DETAIL(id);
},
```

### Nested Routes

For routes like `/notifications/settings`:

1. **File structure:**
   - `app/notifications/settings.tsx`

2. **In routes.ts:**
```typescript
NOTIFICATIONS_SETTINGS: '/notifications/settings',
```

3. **In _layout.tsx:**
```typescript
<Stack.Screen name="notifications/settings" />
```

---

## **Best Practices**

1. ✅ **Always use `ROUTES` constants** - Never hardcode route strings
2. ✅ **Keep route names consistent** - Match file names and route names
3. ✅ **Set `requiresAuth` correctly** - Protect authenticated routes
4. ✅ **Use route configs** - Leverage metadata for permissions
5. ✅ **Test navigation** - Verify routes work from all entry points

---

## **Example: Complete Flow**

```typescript
// 1. routes.ts - Define route
NOTIFICATIONS: '/notifications',

// 2. Create app/notifications.tsx
export default function NotificationsScreen() { ... }

// 3. _layout.tsx - Register
<Stack.Screen name="notifications" />

// 4. Navigate from anywhere
router.push(ROUTES.NOTIFICATIONS);
```

That's it! Your new screen is ready to use! 🎉

