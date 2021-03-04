# About Project

<body>
    <ul>
        <h3>FOODFY</h3>
        <li>
        <p>Foodfy is a project developed on <strong>RocketSeat Bootcamp.</strong></p>
        </li>
        <li>
        <p>The project geared towards culinary in general. A recipe website made by users.</p>
        </li>
    </ul>
</body>

# Still in progress




# About the project

<body>
    <ul>
        <h3>FOODFY</h3>
        <li>
        <p>Foodfy is a project developed on <strong>RocketSeat Bootcamp.</strong></p>
        </li>
        <li>
        <p>The project geared towards culinary in general. A recipe website made by users.</p>
        </li>
    </ul>
</body>
<br>

------
## Preview
![Uploading 60414ffee4ac7937401482.gif…]()

## technologies and Frameworks

### **Backend:** 
>* *JavaScript ([NodeJS])*

>* SQL Server ([PostgresSQL])

>* Framework [Express]

### **Frontend:** 
>* *Nunjucks ([Nunjucks])*

>* JavaScript

>* HTML

>* CSS3

<br>

## `Como Utilizar:`

1. Download the project within the command:
    * `git clone()`

    **Or**
    
    * download the _zip_. file

2. On terminal execute the command **`npm install`** in order to install the dependencies for this project.

3. Use the postgres to setup the database on the file __src/config/db.js__

4. Caso não possua o banco foodfy com suas tabelas criado, execute os comandos presente no arquivo foodfy.sql.

4. Execute the commands on database.sql in order to create the database tables.

5. Após configurar o arquivo _db.js_ e criar o banco, execute o arquivo seed.js (`node seed.js`) para popular alguns dados e testar a aplicação.

5. After that execute the file seed.js on the terminal with the command (`node seed.js`) in order to populate data into the database in order to test the aplication.

6. On terminal execute `npm start` for initialize the application. Open the browser on (**http://localhost:5000/**)

### Tip

In order to use the email service you have to configure the [mailtrap] on the **src/lib/mailer.js** file.

All password are ('123') by default, get the email from the table users(from database) and go to the login route on (`/users/login`)

Consider to sometimes reset the datavase within the commands on the file **database.sql**(`--restart to run seed.js` tag).

<!-- links -->

[Express]:https://expressjs.com/
[NodeJS]:https://nodejs.org/en/
[PostgresSQL]:https://www.postgresql.org/
[Nunjucks]:https://mozilla.github.io/nunjucks/
[o projeto]:https://github.com/alicioromoli/foodfy
[mailtrap]:https://mailtrap.io/