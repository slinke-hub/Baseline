# Baseline

This is a Next.js application for Baseline, a personal basketball training app.

## Transferring Your Project to GitHub

This guide provides the steps to get your application code from this environment onto your local computer and then into a GitHub repository.

### Step 1: Get The Project Code Onto Your Computer

Because this Studio environment does not have an automatic "download project" feature, this step must be done manually.

1.  **Create a New Folder:** On your local computer, create a new, empty folder for your project.
2.  **Ask Me for the Files:** In our chat, ask me for the code for the files you need. I can provide the full content of each file, one or multiple at a time. For example, you can ask:
    *   "Give me the code for `package.json` and `next.config.ts`"
    *   "Give me all the files in the `src/components/ui` directory"
3.  **Recreate the Project Structure:** You will need to create the same folders and files on your computer as you see in the project file list. Copy and paste the code I provide into the corresponding files. This is the most time-consuming part.

### Step 2: Set Up Your Project Locally

Once you have all the project files on your computer, you need to prepare the project.

1.  **Open a Terminal:** Open your command prompt or terminal and navigate into the project folder you created.
2.  **Initialize Git:** Run the following command to initialize a new Git repository.
    ```bash
    git init
    ```
3.  **Install Dependencies:** Run the following command to install all the necessary packages for the app.
    ```bash
    npm install
    ```

### Step 3: Push to GitHub

Now you can push your local project to a new repository on GitHub.

1.  **Create a New Repository on GitHub:** Go to [GitHub.com](https://github.com) and create a new, empty repository. Do **not** initialize it with a README, .gitignore, or license file.
2.  **Link Your Local Repository to GitHub:** In your terminal, add the remote repository URL. Replace `<Your-GitHub-Repo-URL>` with the URL you copied from GitHub.
    ```bash
    git remote add origin <Your-GitHub-Repo-URL>
    ```
3.  **Add, Commit, and Push Your Code:** Run the following commands to send your code to GitHub.
    ```bash
    git add .
    git commit -m "Initial commit from Studio"
    git branch -M main
    git push -u origin main
    ```

Your project code will now be in your GitHub repository.

---

To get started with the code transfer, just let me know which files or folders you'd like me to provide first!