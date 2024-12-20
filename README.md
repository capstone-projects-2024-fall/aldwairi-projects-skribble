   # aldwairi-projects-skribble
# Welcome to Skribble - Your Child's Journaling Needs👋

Skribble is a journaling app geared towards kids aged 6-12, with the goal of establishing self-care habits and an open inner dialogue at a young age to counteract the negative impact of social media on youth. 

## Features
- Create an account using email, password, and birthday (under 13 requires parent email).
- Log in with previously created account.
- Buy clothing items for avatar in the Store.
- Change clothing items for avatar in the Closet; view avatar with selected clothing in closet and homepage.
- Create and delete journal entries in Journal.
- Change app display in Profile (avatar and background color).
- Change and view user data in Profile (change name and email; view coins, exp, streak, and friend code).
- Change parental data in Parental Portal (parental email and parental controls such as Add/View Friends, Chat, Media Sharing, and Time Limit)
- Chat with a chatbot using Chat.
- Add friends using their friend code in Friends.

## How To Run

- Download the latest version of [Node.js](https://nodejs.org/en). Node.js includes the package manager npm, which we'll use later to help with installing our needed dependencies (things our program needs to run).
- Click the green box labeled 'Code', then copy the link under 'HTTPS' by clicking the clipboard icon. 
- Open your preferred Javascript IDE of choice ([VSCode](https://code.visualstudio.com/) is our recommendation). Type in terminal:
    ```
    git clone {your url}
    ```
    to clone the current release to your local repository.

1. Install dependencies by typing in terminal:

   ```
   npm install
   npm install react-native-svg
   npm install react-native-uuid
   npm install expo
   npx expo install expo@^51
   ```
   
2. Start the app by typing in terminal:

   ```
    cd src
    npx expo start
   ```

In the output, you'll find options to open the app in a variety of environments. Currently, the best way to enjoy Skribble is through a web environment. 
# Press "w" to open the web environment 

- Sign up, create an account, and enjoy!
- Please note that if you create a child account (under 13 years of age) you will not have full access to the app upon account creation (some features like Chat, Friends will be missing).
  To enable those features, click **Profile --> Parental Controls**. You can enable/disable features through moving the sliders at the bottom of the page.
- To close the app, interrupt the running process by typing Ctrl+C in your terminal.

# If you want to chat with Ollama (Using Llama 3.1 configuration)
- Use this install and run command to start typing messages to Ollama in the terminal:

   ```
    pip install ollama
    ollama run llama3.1:latest
   ```

## How to Contribute

- Follow the instructions in **How to Build** to copy our latest release and cd to src. Most relevant files can be found under the app directory. Database information can be found in two locations: backend/graph_database and
  app/utils. Current objectives include upgrading our Expo SDK and adjusting our UI to make the mobile app viewing experience more enjoyable. 
