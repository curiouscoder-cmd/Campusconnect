# Fix Missing Users in Profiles Table

## Problem
Users exist in `auth.users` (authentication table) but don't appear in `public.profiles` table. This happens when:
1. Users were created before the trigger was set up
2. The trigger failed to execute for some users
3. The trigger has bugs

## Solution - Run these SQL scripts in Supabase SQL Editor

### Step 1: Diagnose the Issue
Run `check_user_sync_status.sql` to see:
- How many users are in auth.users
- How many profiles exist
- Which users are missing profiles
- Check if specific user (nitya6402@gmail.com) has a profile

### Step 2: Fix the Trigger (Optional but Recommended)
Run `fix_user_trigger.sql` to:
- Recreate the trigger with better error handling
- Add ON CONFLICT handling to prevent duplicates
- Ensure future signups create profiles correctly

### Step 3: Sync Existing Users
Run `sync_auth_users_to_profiles.sql` to:
- Find all users in auth.users that don't have profiles
- Create profile entries for them
- Verify the sync was successful

### Step 4: Verify
After running the sync script, run this quick check:
```sql
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.profiles;
```
The two counts should match.

## How to Run in Supabase

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste each SQL file content
5. Click "Run" or press Cmd+Enter (Mac) / Ctrl+Enter (Windows)

## Files Created
- `check_user_sync_status.sql` - Diagnostic queries
- `fix_user_trigger.sql` - Fix/recreate the trigger
- `sync_auth_users_to_profiles.sql` - Sync missing users

## After Running These Scripts
- All existing users (including nitya6402@gmail.com) will have profiles
- Future signups will automatically create profiles
- Admin users will remain admins
- New users will default to 'user' role
