# Enable Full Trash Functionality

Your Google Drive Clone is currently working with **basic delete** (permanent deletion). To enable **full trash functionality** (soft delete), follow these steps:

## Step 1: Add Database Columns

1. **Open your Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run the following SQL commands**:

```sql
-- Add trash columns to files table
ALTER TABLE files 
ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add trash columns to folders table
ALTER TABLE folders 
ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_files_is_trashed ON files(is_trashed);
CREATE INDEX IF NOT EXISTS idx_folders_is_trashed ON folders(is_trashed);
CREATE INDEX IF NOT EXISTS idx_files_owner_trashed ON files(owner_id, is_trashed);
CREATE INDEX IF NOT EXISTS idx_folders_owner_trashed ON folders(owner_id, is_trashed);

-- Update existing records to set is_trashed = false
UPDATE files SET is_trashed = FALSE WHERE is_trashed IS NULL;
UPDATE folders SET is_trashed = FALSE WHERE is_trashed IS NULL;
```

## Step 2: Restart Backend

After running the SQL commands, restart your backend server:

```bash
# Stop the current backend (Ctrl+C if running)
# Then restart:
cd backend
python3 start.py
```

## Step 3: Verify Trash Functionality

Once restarted, you'll have:

✅ **Soft Delete** - Deleted files/folders move to trash  
✅ **Trash View** - View deleted items at `/trash`  
✅ **Restore Function** - Restore items from trash  
✅ **Permanent Delete** - Remove items permanently from trash  
✅ **Auto-delete Warning** - 30-day cleanup notification  

## Current Status

**Without database columns (current):**
- ✅ File upload/download working
- ✅ Folder creation working  
- ✅ Delete working (permanent deletion)
- ❌ Trash functionality disabled

**With database columns (after SQL):**
- ✅ File upload/download working
- ✅ Folder creation working
- ✅ Delete working (moves to trash)
- ✅ Full trash functionality enabled

The application automatically detects and uses trash functionality when the database columns are available!