Jokes App:

Github URL:
Admin = https://github.com/Mogesh21/jokes_app_frontend
Server = https://github.com/Mogesh21/jokes_app_backend

Development URL:

Admin: https://jokesapp.skyraantech.com
Webform: https://jokesapp.skyraantech.com/server (Swagger)

Admin Credentials:
username: admin@skyraan.com
password: Admin@123

Database Credentials & .env:

PORT=9002
SERVER=https://jokesapp.skyraantech.com
NODE_ENV=production
SECRET_KEY=8c7e64c86039817b543143618047e14a17a89adee7a99b2c4f4cd039b988955b

HOST=localhost
USER=skyraantech_jokesapp
PASSWORD=](0KtjPI=MAnPFum
DATABASE=skyraantech_jokesapp_db

Technologies:

1. Dashboard => React
2. Backend => Express => (validation=> express-validator, webform => swagger, file-upload => multer)

Backend flow: Routes => controller => models

MODULES:

1. App Module:

In future there may be many jokes app based on language. Each app can have different categories. So that this app module is used to create an app and add the desired categories to that app. Only categories which is added to that app is visible on that app.

2. Types Module:

Each categories can have different fields like joke, image, answer and so on. So that type module is used to create types of different fields, Where each type represent a screen. We can reuse the type for different categories which shares the same screen.

Currently available field are:

1. Conversation
2. Joke
3. Joke Image
4. Text Answer
5. Image Answer

We can select any field to create a new type which can be reused for many categories.

3. Category Module:

Each joke must comes under a category which may be a direct or indirect. The category is used to group jokes of same kind together.

Creating a category module includes: 1. Selecting Type 2. Name 3. Cover Image 4. Version of the app 5. Card background color and border color 6. has_subcategory

4. Subcategory Module:

Subcategories are subdivisions in a category which is used in some of the categories. Subcategory only be created where the category has true for has_subcategory. Subcategory has the same fields category.

5. Jokes Module:

Joke can have different kinds of fields based on the category. Joke can be uploaded via category as well as excel file. Excel file upload only supports fields which can only have text inputs. Jokes having image field can only be added directly.