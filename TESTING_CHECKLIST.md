# Testing Checklist for Track It

## 🚀 Quick Start
1. The dev server should be running at `http://localhost:5173` (or the port shown in terminal)
2. Open your browser and navigate to that URL
3. You should see the "Track It" app with navigation

---

## ✅ Phase 1 Feature Testing

### 1. Navigation & Theme
- [ ] **Navigation works**: Click between "Today", "Habits", "History", "Settings"
- [ ] **Theme toggle**: Click the 🌙/☀️ button - should switch between light/dark mode
- [ ] **Mobile menu**: On mobile/small screen, hamburger menu (☰) should appear
- [ ] **Active route highlighting**: Current page should be highlighted in nav

### 2. Habits Page - Create Habit
- [ ] **Open Habits page**: Click "Habits" in navigation
- [ ] **Click "New Habit" button**: Form should appear
- [ ] **Fill out form**:
  - [ ] Enter habit name (e.g., "Morning Exercise")
  - [ ] Select frequency: Try "Daily" first
  - [ ] Set duration: e.g., 30 days
  - [ ] Select priority: e.g., High
  - [ ] (Optional) Add reminder time
  - [ ] (Optional) Add description
- [ ] **Submit**: Click "Create Habit"
- [ ] **Verify**: Habit should appear in the list below

### 3. Habits Page - Weekly Habit
- [ ] **Create another habit**: Click "New Habit"
- [ ] **Select "Weekly" frequency**: Day selector should appear
- [ ] **Select days**: Click Mon, Wed, Fri
- [ ] **Complete form** and submit
- [ ] **Verify**: Habit shows "Weekly (Mon, Wed, Fri)" in list

### 4. Habits Page - Edit & Delete
- [ ] **Edit habit**: Click "Edit" on any habit
- [ ] **Modify fields**: Change name or priority
- [ ] **Save**: Click "Update Habit"
- [ ] **Verify**: Changes should appear in list
- [ ] **Delete habit**: Click "Delete" on a habit
- [ ] **Confirm deletion**: Click OK in confirmation dialog
- [ ] **Verify**: Habit should be removed

### 5. Today Page - View Habits
- [ ] **Navigate to Today page**: Click "Today" in nav
- [ ] **Check habits due today**: 
  - Daily habits should always appear
  - Weekly habits should only appear on their selected days
- [ ] **Empty state**: If no habits due, should show helpful message

### 6. Today Page - Check Off Habits
- [ ] **Click checkbox** on a habit card
- [ ] **Verify**: 
  - Checkmark appears
  - Habit gets strikethrough
  - Card opacity reduces
- [ ] **Progress bar updates**: Percentage should increase
- [ ] **Uncheck**: Click checkbox again
- [ ] **Verify**: Habit returns to normal state

### 7. Today Page - Progress Stats
- [ ] **View stats card**: Should show "X of Y habits completed"
- [ ] **Progress bar**: Green bar should fill based on completion %
- [ ] **Check/uncheck habits**: Stats should update in real-time

### 8. Today Page - Daily Reflection
- [ ] **Scroll to reflection section**: At bottom of page
- [ ] **Type reflection**: Enter some text
- [ ] **Auto-save**: Click away from textarea
- [ ] **Verify**: "Saved" indicator appears briefly
- [ ] **Keyboard shortcut**: Try Ctrl/Cmd + Enter to save
- [ ] **Refresh page**: Reflection should persist

### 9. Data Persistence
- [ ] **Create some habits and entries**
- [ ] **Refresh browser**: Press F5 or Cmd+R
- [ ] **Verify**: All data should still be there
- [ ] **Close and reopen browser**: Data should persist

### 10. Responsive Design
- [ ] **Desktop view**: Everything should look good
- [ ] **Mobile view**: 
  - Resize browser to mobile width (or use dev tools)
  - Navigation should show hamburger menu
  - Forms should stack vertically
  - Buttons should be full-width on mobile
- [ ] **Tablet view**: Should adapt smoothly

### 11. Empty States
- [ ] **No habits**: Should show helpful empty state
- [ ] **No habits due today**: Should show appropriate message
- [ ] **History page**: Should show placeholder message
- [ ] **Settings page**: Should show placeholder message

### 12. Error Handling
- [ ] **Form validation**: Try submitting empty form
- [ ] **Weekly habit**: Try creating weekly habit with no days selected
- [ ] **Verify**: Error messages should appear

---

## 🐛 Common Issues to Check

### If something doesn't work:

1. **Check browser console** (F12 → Console tab):
   - Look for red error messages
   - Report any errors you see

2. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Look for `trackit_app_data` key
   - Should contain your habits, entries, reflections

3. **Network issues**:
   - Make sure dev server is running
   - Check terminal for any errors

4. **TypeScript errors**:
   - Check terminal where `npm run dev` is running
   - Look for compilation errors

---

## 📝 Test Scenarios

### Scenario 1: First-time User
1. Open app (should be empty)
2. Create first habit (Daily, 30 days, High priority)
3. Go to Today page
4. Check off the habit
5. Write a reflection
6. Refresh page - everything should persist

### Scenario 2: Weekly Habits
1. Create habit: "Gym" - Weekly (Mon, Wed, Fri)
2. Create habit: "Reading" - Daily
3. Go to Today page
4. Only habits due today should appear
5. Check them off
6. Progress should update

### Scenario 3: Multiple Habits
1. Create 5+ habits with different priorities
2. Mix of daily and weekly
3. Go to Today page
4. Check off some, leave others
5. Progress percentage should be accurate

---

## ✅ Success Criteria

The app is working correctly if:
- ✅ You can create, edit, and delete habits
- ✅ Habits appear on Today page when due
- ✅ You can check/uncheck habits
- ✅ Progress stats update correctly
- ✅ Daily reflections save automatically
- ✅ All data persists after refresh
- ✅ Theme toggle works
- ✅ Mobile navigation works
- ✅ No console errors

---

## 🎯 Next Steps After Testing

If everything works:
- 🎉 **Congratulations!** Phase 1 MVP is complete
- You can start using it for real habit tracking
- Consider moving to Phase 2 (History & Insights)

If you find issues:
- Note them down
- Check browser console for errors
- We can fix them together!
