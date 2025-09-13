GOOSE Social Media Application

Student Name: Alvin He
Vanderbilt Email: alvin.t.he@vanderbilt.edu

HOW TO DOWNLOAD AND RUN THE PROGRAM

This application consists of a React frontend (client) and Node.js/Express backend (server).

Prerequisites:
- Node.js installed on your system
- MongoDB database connection (local or cloud)

Setup Instructions:
1. Clone the repository to your local machine
2. Navigate to the server folder and run:
   npm install
   npm run dev
3. Open a new terminal, navigate to the client folder and run:
   npm install
   npm run dev
4. The client will typically run on http://localhost:5173 and the server on http://localhost:3000
5. Make sure your environment variables are properly configured in both client and server folders

Environment Variables:
- Client: Create .env file with:
  VITE_API_URL=http://localhost:3000/api

- Server: Create .env file with:
  PORT=3000
  MONGO_URL=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret

Note: The .env files are included with this submission with working credentials.

CHALLENGE REFLECTION

This coding challenge was very difficult because it was my first time doing full-stack development. I felt that MongoDB and the API requests were pretty easy to understand but I didn't expect the frontend to take as long as it did. The most challenging aspect was debugging and making sure that the user authentication was always working when it needed to.

FEEDBACK

The challenge helped me learn a lot about frontend and backend development. I had a lot of features I wanted to implement and some that I got to but only partially (search). I feel that with an assignment this wide in scope, I would have appreciated a little more time to make sure everything is working as expected.

Completion form:
https://forms.office.com/Pages/ResponsePage.aspx?id=OX9aur7js0q0UGf6gPrsreT3wWYcOlNGmtQXyTGw0ltUNjRKRjQyNldWRUhIMEhZSlhBVFpQRzZOSi4u