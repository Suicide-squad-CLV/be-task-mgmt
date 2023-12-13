## Before start

1. Duplicate `.env.example` file and change name to `.env`
2. Change the database connection

   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME="task_management"
   DATABASE_USERNAME="postgres"
   DATABASE_PASSWORD="12345678"
   ```

3. Run following command

   ```
   yarn migrate:run
   ```

4. Seeding the database

   _We used `typeorm-extension` as the package for helping to seeding our data_

   ```
   yarn seed:run
   ```

## Serve your application

```
yarn start:dev
```

## Configuration Email

1.  Turn on 2 step verification on your email

2.  Go to App Password > Create new application > Copy generated password and pass to environment file

```
    EMAIL_USER="nestjs.application@gmail.com"
    EMAIL_PASSWORD="abchf3ifjlkjsdkfj94"
```

## Start BFF source

```
yarn start:dev
```

_Change your url connection if needed_
