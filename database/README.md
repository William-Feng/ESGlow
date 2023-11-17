# ESGlow Database

## Setup

_Note that if you are using Docker, you can skip the following steps and simply run `./start.sh` in the root directory._

### Prerequisites

If Docker is not installed on your machine, visit [Docker Desktop's official page](https://www.docker.com/products/docker-desktop) to download it.

- Navigate to the project's database directory from your terminal.
- Run `chmod +x init_db.sh` to ensure the bash script has correct permissions.

### Starting up the Database

- Start up the PostgreSQL database by executing:
  **`./init_db.sh`**
- If this is successful, you should see display logs indicating the status of the database. You should also see it as a running container in Docker Desktop.

### Accessing the Database

- Open up a separate terminal (to ensure that the Docker container does not stop).
- You should be able to see the database as a running container if you type `docker ps` in your terminal.
- Run **`docker exec -it postgres psql -U postgres esglow`** to access the Docker container.
- You should now be inside the database interface and can type things like `\dt` to list all the tables.
- To see the actual data, you can query certain tables, such as `select * from users;`.
- Run `\q` to exit the PostgreSQL database interface.

### Stopping the Database

- To stop the PostgreSQL container, you can manually delete it in Docker Desktop.
- Alternatively, run `docker-compose down`.

## Code Structure

- `helpers/`: Contains helper functions for the database, yet are not used at all.
  - `generate_data.py`: Generates random fake data for the database, which facilitated the creation of the `2_insert_data.sql` file.
  - `helpers.sql`: Queries the database to get information about the tables, which facilitated the checking of the backend endpoints.
- `1_create_tables.sql`: Creates the tables for the relational database, executed upon starting up the Docker container.
- `2_insert_data.sql`: Inserts fake data into the relational database, executed upon starting up the Docker container.
- `init_db.sh`: Executes the docker compose file to solely start up the PostgreSQL database as a script.
