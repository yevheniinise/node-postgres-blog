# Node Postgres Blog

A simple medium like app.

# To run the app

1. Clone the repo
2. `cd node-postgres-blog/db`
3. `cat install.sql | psql`
> or if you are not logged into the `postgres` user account `cat install.sql | psql -U postgres`
4. `cd ../server`
5. `npm install` and `npm start`

`install.sql` creates a database and populates it with test data including a few users:
- steve.best@gmail.com
- john.lawrence@gmail.com
- admin@admin.com
> The password for all is `password`
