# ResBot Backend

Fetches articles from RSS feeds, sends them to ChatGPT for analysis, then sends a digest of all new articles to the user.

## Features

Two main jobs:

- Fetch Articles
  - Gets the new article data from RSS feeds
  - Fetches and cleans the article content
  - Sends article content to ChatGPT for analysis
  - Saves all data in the DB
- Send Digest
  - Sends all un-sent articles to an email address

## Usage

### Running application

- Configure application
  - Create a `.env` file
  - Fill out environment variables
    - OPENAI_API_KEY
    - EMAIL_PASSWORD
    - EMAIL_ADDRESS
    - DB_NAME
- Download packages (`npm i`)
- Start application (`npm start`)

### Configuring Feeds

At the moment you have to do this directly in the DB. The DB is just a JSON file in `/src/db` with the format:

```
{
  "feeds": [],
  "articles": []
}
```

For each feed, add an object to the "feeds" list, including `url` and `name`.
Sample:

```
    {
      "url": "https://www.google.com/alerts/feeds/10052944478562446622/2668362383341309773",
      "name": "Google Alert - \"EU-ETS\" shipping"
    }
```

### Changing Jobs Schedule

At the moment, you just need to change the cron job schedule directly in the code.
