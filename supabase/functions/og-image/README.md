# OpenGraph Image Generator Edge Function

This Supabase Edge Function generates dynamic OpenGraph (OG) images for meeting invitations. These images appear when links are shared on social media platforms or messaging apps.

## Deployment

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project (if not already linked):
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy og-image --no-verify-jwt
   ```

   Note: We use `--no-verify-jwt` since this is a public endpoint that doesn't require authentication.

## Usage

Once deployed, the function is available at:

```
https://<your-supabase-project>.supabase.co/functions/v1/og-image
```

### Query Parameters

- `title`: The meeting title
- `organizer`: The name of the person who created the meeting
- `description`: A description of the meeting
- `id`: The meeting ID

### Example URL

```
https://<your-supabase-project>.supabase.co/functions/v1/og-image?title=Weekly%20Team%20Meeting&organizer=John%20Doe&description=Discuss%20project%20updates&id=123456&t=1620000000000
```

## Local Development

To run and test the function locally:

```bash
cd supabase/functions/og-image
supabase functions serve og-image --no-verify-jwt
```

The function will be available at `http://localhost:54321/functions/v1/og-image`. 