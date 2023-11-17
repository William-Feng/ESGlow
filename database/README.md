# ESGlow Database

## Installation Prerequisites

If Docker is not installed on your machine, visit [Docker Desktop's official page](https://www.docker.com/products/docker-desktop) to download it.

- Navigate to the project's database directory from your terminal.
- Run `chmod +x init_db.sh` to ensure the bash script has correct permissions.
- Execute the script to start up the database with the command **`./init_db.sh`**

If this is successful, you should see display logs indicating the status of the database. You should also see it as a running container in Docker Desktop.

## Accessing the Database

- Open up a separate terminal (to ensure that the Docker container does not stop).
- You should be able to see the database as a running container if you type `docker ps` in your terminal.
- Run **`docker exec -it postgres psql -U postgres esglow`** to access the Docker container.
- You should now be inside the database interface and can type things like `\dt` to list all the tables.
- To see the actual data, you can query certain tables, such as `select * from users;`.
- Run `\q` to exit the PostgreSQL database interface.

## Stopping the Database

- To stop the PostgreSQL container, you can manually delete it in Docker Desktop.
- Alternatively, run `docker-compose down`.
