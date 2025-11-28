# How to Use Your New Backend

You have successfully removed Supabase and moved to a self-hosted backend using **Google Drive** for storage.

## 1. How it Works
- **Data**: All your posts, events, and subscribers are saved in a single file called `database.json` inside your Google Drive folder.
- **Media**: Videos and images you upload are saved directly to that same Google Drive folder.
- **Hosting**: Your site runs on Vercel (or anywhere else), but it talks to Google Drive to get your content.

## 2. Admin Area
You have a new Admin Dashboard at `/admin`.

### Logging In
1.  Go to `https://your-site.com/admin` (or `http://localhost:3000/admin` when testing).
2.  Enter your password: `admin123` (You can change this in your `.env.local` file).

### Managing Content
- **Dashboard**: You will see a grid of your posts and videos, similar to TikTok.
- **Create New**: Click the "+ Create New" button.
- **Uploads**: You can upload videos or images directly. They will be sent to your Google Drive.
- **Delete**: You can delete items directly from the dashboard.

## 3. Troubleshooting
- **"Loading..." forever**: Check if your Google Drive credentials are correct in `.env.local`.
- **Uploads failing**: Make sure the Google Drive folder is shared with the Service Account email as an **Editor**.
- **Changes not showing**: It might take a few seconds for Google Drive to update. Refresh the page.

## 4. Backup
Since everything is in Google Drive, you already have a backup! You can see all your files in the `BlueMoon_Data` folder in your Drive.
