# Web app

The web app will be built with Next.js and provides the core user experience:

- Search for contestants and episodes.
- View contestant pages with performances, ratings, and comments.
- View episode pages with timestamped performance links.
- Leaderboards for top performances and contestants.
- Host/guest pages with episode lists.

Planned pages:

- `/` Home (search + trending)
- `/contestants` Directory
- `/contestants/[id]` Contestant detail
- `/episodes/[id]` Episode detail
- `/leaderboards`
- `/hosts/[id]`
- `/guests/[id]`

The app will consume API routes hosted in the backend or Next.js API routes.

Current scaffolding:

- Basic Next.js App Router setup.
- API route handlers for `episodes`, `contestants`, and `performances` with mock data.
- API routes use the database client when `DATABASE_URL` is available.
