# How to Deploy Your "Baseline" App

This guide provides the steps to deploy your application to Firebase Hosting from your local computer. This process involves getting the code onto your machine, setting up the necessary tools, and running the deployment command.

## Step 1: Get The Project Code Onto Your Computer

Because this Studio environment does not have a "download project" feature, this step must be done manually.

1.  **Create a New Folder:** On your computer, create a new, empty folder. For example, `C:\Users\YourName\Desktop\BaselineApp`.
2.  **Ask Me for the Files:** In our chat, ask me for the code for the files you need. I will provide you with the full content of each file. For example, you can ask:
    *   "Give me the code for `package.json` and `tailwind.config.ts`"
    *   "Give me all the files in the `src/app` directory"
3.  **Recreate the Project Structure:** You will need to create the same folders and files on your computer as you see in the project file list. Copy and paste the code I provide into the corresponding files. This will be time-consuming, and I apologize for the inconvenience.

## Step 2: Install Required Software

If you don't already have them installed, you will need Node.js (which includes npm) and the Firebase CLI.

1.  **Install Node.js:** Download and install it from [nodejs.org](https://nodejs.org/).
2.  **Install Firebase CLI:** Open your command prompt (cmd) or terminal and run this command:
    ```bash
    npm install -g firebase-tools
    ```

## Step 3: Set Up Your Project Locally

Once you have all the files on your computer, you need to prepare the project.

1.  **Open a Terminal:** Open your command prompt or terminal and navigate into the project folder you created in Step 1.
    ```bash
    cd C:\Users\YourName\Desktop\BaselineApp
    ```
2.  **Install Dependencies:** Run the following command to install all the necessary packages for the app (like React and Next.js).
    ```bash
    npm install
    ```
3.  **Log in to Firebase:** Connect your terminal to your Firebase account.
    ```bash
    firebase login
    ```
    This will open a browser window for you to sign in to your Google account.

## Step 4: Deploy the App

This is the final step. The project is already configured to use the correct Firebase project ID (`studio-1455774830-cbb04`).

1.  **Run the Deploy Command:** In your terminal (while inside your project folder), run the following command:
    ```bash
    firebase deploy --only hosting
    ```
2.  **Get Your URL:** After the command finishes, your terminal will display the **Hosting URL**. This is the live link to your application. It will look like this: `https://studio-1455774830-cbb04.web.app`.

---

I am here to help you through this process. Please start by asking me for the files you want to copy first, and I will provide the code immediately.