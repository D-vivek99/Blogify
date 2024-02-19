MONGO_URL = mongodb+srv://dhakadvivek99:Vivek$123#@cluster0.m1jdxki.mongodb.net/blogify-aws/?retryWrites=true&w=majority


Creating a Bloging website where user can login / create new account also, and each user will be able to see all blogs(including other user's) but can only add Blog or comment on a particular Blog only if he/she is logged-in.

Features included:
-user login/sign-up
-password hashing
-authentication using JWT tokens
-uploading files
-SSR rendering using EJS
-customer middlewares in MongoDB
-deployment on AWS (Amazon Elastic Bean)


Other features that can be included:
1. Option to edit the blog (only for author of that Blog)
2. Option to delete the blog (only for author of that Blog)
3. web-site theme (light/dark) switch
4. Pagination (10 or 15 blogs per page)
5. Fix signup/signin UI
6. Add favicon
7. Maybe a footer can be added to the webpages
8. 

Bugs to be fixed:
1. While adding comments, taking only Blog-author name in commented_by in comments, instead of the one who actually commented.




// Deployment guidelines to follow:
-> Always have below line set in "package.json" file: "start": "node app.js"    (on production no need to restart server again & again using nodemon, so node is used)
-> Secondly, cloud services provider by-default use "app.js" as file name for entry point. So, we will be changing name from "index.js" to "app.js".
-> We need to make a .env file for storing the local variables like, PORT, MONGO_URL. (Becoz that file will be read automatically while deployment & that is a good practice, and in producion we don't know which PORT is available fo runing our appilication, as we know on our local machine)
-> Since app will be running on cloud, so will also be requiring a cloud MongoDB.

_CloudWatch (Complete logs that are generated for that application in production)
_LoadBalancer (To handle multiple requests)