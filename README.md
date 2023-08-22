# Running the sample white labelled Filo App

This guide will walk you through the process of running your sample white-labelled filo webapp. We'll cover setting up your development environment. For production, we recommend you implement the same in your existing web app in your desired preference of application framework. 

## Prerequisites

1. **Node.js and yarn**: Make sure you have Node.js and yarn (Node Package Manager) installed on your system. You can download them from the [official Node.js website](https://nodejs.org/).

2. **Git**: You'll need Git for version control and cloning the repository. Download and install Git from the [Git website](https://git-scm.com/).

## Cloning the Repository

1. **Clone the Repository**: Open your terminal and navigate to the directory where you want to store your project. Run the following command to clone the repository:
   ```bash
   git clone https://github.com/filo-tech/whilelabelled-demo-app-web.git
   ```
2. **Navigate to the Project Directory**: Enter the cloned directory using the cd command:
    ```bash
   cd whilelabelled-demo-app-web
    ```

## Setting Up the Project

1. **Install Dependencies**: Run the following command to install the project dependencies defined in package.json:
    ```bash
   yarn install
    ```
2. **Configuration**: Create a `.env.development` file in the root folder of the project and paste the following data:
    ```env
    FILO_TOKEN=[your filo token]
    FILO_HOST=https://staging.api.askfilo.com
    FILO_PARTNER_ID=[your filo partner id]
    FILO_APP=[your filo application url]
    ```

## Running the Application Locally

1. **Start the server**
    ```bash
    yarn start
    ```
2. **Access the Application**: Open your web browser and navigate to `http://localhost:3000`