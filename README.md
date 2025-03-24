# Enterprise App Integration

## Overview

**Enterprise App Integration** is a web application designed to streamline workflows for enterprises by integrating various services such as **Google Drive**, **Slack**, and **Jira** into a central dashboard. This allows users to manage their files, channels, and issues across these services seamlessly, increasing productivity and simplifying team collaboration.

The application provides features like:
- Accessing Google Drive files directly from the dashboard
- Managing Slack channel messages
- Tracking and resolving Jira issues

---

## Features

- **Google Drive Integration:**
  - View, manage, and download files directly from Google Drive without leaving the dashboard.
  - Upload and download files to and from Google Drive seamlessly.

- **Slack Integration:**
  - View and manage messages from Slack channels.
  - Interact with Slack messages and streamline team communication.

- **Jira Integration:**
  - View and manage issues from Jira, providing a unified interface to track tasks and resolve them.

---

## Getting Started

Follow these instructions to get the application running on your local machine.

## Database Setup

This project uses **Supabase** for database management. Below are the instructions to set up the necessary tables in Supabase.

### Steps to Set Up the Database in Supabase

1. **Log in to Supabase:**
   - Visit [Supabase](https://supabase.io/) and log in to your account.

2. **Create a Project:**
   - After logging in, click **New Project**.
   - Fill in the necessary details such as project name, password, and the region.
   - Click **Create Project**.

3. **Access SQL Editor:**
   - After your project is created, navigate to the **SQL Editor** in the left sidebar.

4. **Run SQL Queries:**
   - Copy and paste the following SQL queries into the **SQL Editor** and click **RUN** to execute them.

### SQL Queries to Create Tables:

```sql
-- Users Table
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text,
  role text default 'user',
  created_at timestamp default now()
);

-- Google Drive Files Table
create table if not exists google_drive_files (
  id serial primary key,
  file_id text not null unique,
  file_name text not null,
  modified_time timestamp not null
);

-- Slack Channels Table
create table if not exists slack_channels (
  id serial primary key,
  slack_channel_id text unique not null,
  name text not null,
  created_at timestamp default now()
);

-- Slack Messages Table
create table if not exists slack_messages (
  id serial primary key,
  slack_channel_id text references slack_channels(slack_channel_id),
  message_id text unique not null,
  user_id text,
  message_text text,
  timestamp timestamp,
  created_at timestamp default now()
);

-- Jira Issues Table
create table if not exists jira_issues (
  issue_id text primary key,
  summary text,
  status text,
  priority text,
  reporter text,
  assignee text,
  created timestamp,
  updated timestamp
);

```
**Disable RLS:**
   - Copy and paste the following SQL queries into the **SQL Editor** and click **RUN** to execute them.

  ```sql
-- Disable RLS for users table
alter table users disable row level security;

-- Disable RLS for google_drive_files table
alter table google_drive_files disable row level security;

-- Disable RLS for slack_channels table
alter table slack_channels disable row level security;

-- Disable RLS for slack_messages table
alter table slack_messages disable row level security;

-- Disable RLS for jira_issues table
alter table jira_issues disable row level security;
  ```


### Prerequisites

Before setting up the project, make sure you have the following installed:
- **Node.js** (v18 or above)
- **npm** (Node Package Manager)

### Backend Setup

1. Clone the repository and navigate to the backend directory:
    ```bash
    git clone https://github.com/furtivegod/Test_Project-Aither.git
    cd test_Project-Aither/backend
    ```

2. Install the backend dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the backend directory and add the required environment variables. Below are the steps to obtain the required values.

---

## Environment Variables Setup

Here is a list of all the required environment variables for your **.env** file. These values are required to make the app work with Google, Slack, and Jira APIs.

### 1. **Supabase**
   - **SUPABASE_URL**: Your Supabase instance URL. You can find it in the [Supabase Dashboard](https://app.supabase.io/).
   - **SUPABASE_ANON_KEY**: The **anon** key from your Supabase project. This can be found in the **Project Settings/Data API** section of the Supabase dashboard.
   - **SUPABASE_SERVICE_ROLE_KEY**: The service role key from your Supabase project. This can be found in the **Project Settings/Data API** section of the Supabase dashboard. This is required to access admin-level functionalities.
   - **JWT Secret**: This secret key is sued to sign JWT tokens, you can generate a random string using a secure mothod or get it in the **Project Settings/Data API** section of the Supabase dashboard.

### 3. **Slack**
   - **SLACK_OAUTH_TOKEN**: To get the OAuth token for Slack, follow these steps:
     1. Go to [Slack API](https://api.slack.com/apps).
     2. Create a new app(from scratch) or use existing app.
     3. In the **OAuth & Permissions** section add the following user token scopes and install to the project.
        - `channels:history`
        - `channels:read`
        - `groups:history`
        - `groups:read`
        - `im:history`
        - `im:read`
        - `mpim:history`
        - `mpim:read`
        - `users:read`
     4. Get the **OAuth 'User' Token**.
     5. Paste this token in the `.env` file.

### 4. **Jira**
   - **JIRA_API_TOKEN**: To generate your API token for Jira, follow these steps:
     1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security).
     2. Under **API Token**, generate a new token and copy it.
   - **JIRA_EMAIL_ADDRESS**: Your email address registered with Jira.
   - **JIRA_BASE_URL**: Your Jira instance's base URL, for example: `https://<your-domain>.atlassian.net`.

### 5. **Google OAuth**
   - **GOOGLE_CLIENT_ID**: Create a project in the [Google Developer Console](https://console.developers.google.com/apis), in the **Cedentials** section create the **Google OAuth 2.0**, then get your **Client ID**.
      - Make sure that you correctly add URI to the **Authorized JavaScript Origins** and **Authorized redirect URIs**
      ```
      This project uses:
      Authorized JavaScript Origins: http://localhost:5173
      Authorized redirect URIs: http://localhost:4000/api/auth/google/callback
      ```
   - **GOOGLE_CLIENT_SECRET**: After creating the project, you will also get your **Client Secret** in the **Credentials** section.
   - **GOOGLE_REDIRECT_URI**: This is the URI that Google will redirect to after authentication. For local development, this will be:
     ```plaintext
     http://localhost:4000/api/auth/google/callback
     ```

### 6. **Google Service Account**
   - **GOOGLE_SERVICE_ACCOUNT_KEY**: The path to your **Google Service Account JSON file**. This file is required to interact with Google services such as Google Drive. You can get this by creating a Google Service Account in the [Google Cloud Console](https://console.cloud.google.com/apis).

### 7.**Google Drive Email**
   - **Google Drive Email**: Your Email that is used in Google Drive

### Example `.env` file

Once you have gathered the required values, create a `.env` file in the backend root directory with the following content:

```env
SUPABASE_URL=https://<your-supabase-instance-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
JWT_SECRET=<your-secret-key>

SLACK_OAUTH_TOKEN=xoxp-<your-slack-oauth-token>

JIRA_API_TOKEN=<your-jira-api-token>
JIRA_EMAIL_ADDRESS=<your-jira-email-address>
JIRA_BASE_URL=https://<your-jira-domain>.atlassian.net

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback

GOOGLE_SERVICE_ACCOUNT=./path/google-service-account.json

GOOGLE_DRIVE_EMAIL=<your-work-email>

```
Make sure to replace ./path/google-service-account.json with the actual path where you saved your JSON file.

## Google Drive File Access Setup

This project only shows files in Google Drive that are shared with your **Google Service Account**.

To enable this, follow these steps:

1. **Go to Google Drive:**
   - Open [Google Drive](https://drive.google.com/).

2. **Select the File:**
   - Click on the file you want to share.

3. **Share the File:**
   - Right-click on the file and select **Share**.
   
4. **Add Service Account Email:**
   - In the "Share with people and groups" field, enter the **Google Service Account's email** (you can find this email in your service account JSON file).
   
5. **Set Permissions:**
   - Make sure you set the appropriate permissions for the service account (e.g., "Viewer", "Editor" based on your needs).
   
6. **Save the Share Settings:**
   - Click **Send** or **Share** to grant access.

After this, the shared files will be accessible to your project.

---



4. Run the backend:
    ```bash
    npm run dev
    ```

The backend will now be running on `http://localhost:4000`.

---

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd test_Project-Aither/frontend
    ```

2. Install the frontend dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the frontend directory for the environment variables (for example, the Google OAuth **client ID**).

## Environment Variables (Frontend)

Please add the following variables to `.env` file in the frontend project:

- **VITE_APP_APP_ENV**: Set this to `"development"`, `"uat"`, or `"production"` based on environment.
- **VITE_APP_API_URL**: Set this to the backend API URL (e.g., `http://localhost:4000/api` for local development).
- **VITE_APP_GOOGLE_CLIENT_ID**: This should be the **same Google Client ID** used in the backend's Google OAuth setup.

### Example `.env` file for Frontend

```env
VITE_APP_APP_ENV=development  # "development" | "uat" | "production"
VITE_APP_API_URL="http://localhost:4000/api"  # Backend API URL
VITE_APP_GOOGLE_CLIENT_ID=686026557992....  # Google OAuth Client ID
```


4. Run the frontend:
    ```bash
    npm run dev
    ```

The frontend will now be running on `http://localhost:5173`.

---

## Usage

1. **Login:**
   - Open the application at `http://localhost:5173`.
   - You can log in with email and password or log in with your Google account by clicking the **Sign in with Google** button.
   - After successful authentication, you'll be redirected to the **dashboard**.

2. **Dashboard:**
   - The dashboard allows you to:
     - View Google Drive files, interact with Slack channels, and track Jira issues all in one place.
     - Switch between the different services using the sidebar tabs: **Google Drive**, **Slack**, **Jira**.
     - Log out from the dashboard.

---

## Tech Stack

- **Backend:**
  - **Node.js** with **Express.js**
  - **Google Drive API** for file management
  - **Slack API** for Slack message integration
  - **Jira API** for issue tracking
  - **Supabase** for user authentication and data storage

- **Frontend:**
  - **React.js** for UI components
  - **Tailwind CSS** for styling
  - **Google OAuth** for authentication

---

## Scalability & Extensibility

### **1. Real-time Synchronization and Interaction**
   - The initial version of the project implements data synchronization in scheduled intervals. However, to **enhance real-time interaction**, future releases will leverage **webhooks** or **socket-based solutions** to provide real-time updates and notifications. This improvement will **streamline workflows** and keep all integrations **instantaneous** for end users, creating an interactive experience.

### **2. Enhanced Slack Integration – Messaging**
   - **Beyond just fetching messages**, future versions will allow users to send messages directly to Slack channels or individuals. This **interactive Slack feature** will include rich formatting options, integrations with Slack bots, and custom interactions, making it a **fully-fledged communication hub**.

### **3. Jira Management and Issue Lifecycle**
   - While the current implementation only fetches Jira issues, a **next-level feature** will empower users to not only create and update Jira issues but also transition issues across different stages, allowing users to manage their Jira tickets entirely from within the platform. **Custom workflows** for teams can also be created, adding a new layer of functionality.

### **4. Expandability with Other Tools**
   - This project is built with flexibility in mind. There are plans to **integrate additional platforms** like **Asana**, **Trello**, or **Microsoft Teams**, providing users with a single platform to manage all their productivity tools. This **cross-platform support** will allow for more robust project management.

### **5. Scalable Architecture for Future Growth**
   - The system is designed to scale efficiently, ensuring it can handle **a large number of integrations**, **team members**, and **data requests**. This scalability allows the system to grow as the user base increases without affecting performance. The architecture will support **horizontal scaling** and **microservices**, enabling easy integration with even more platforms in the future.

### **6. Advanced Notifications and Alerts**
   - As the project grows, so will its **alerting and notification system**. For instance, users will be notified of **new Slack messages**, **new Jira tickets**, or **updates to Google Drive files**. This system will allow teams to stay up-to-date and **respond in real time**, increasing the efficiency of team communication.


---
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
