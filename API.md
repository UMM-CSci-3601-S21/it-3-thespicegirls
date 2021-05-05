# API key setup Instructions <!-- omit in toc -->

- [Summary](#summary)
- [Step 1: Log in to the google credentials page](#step-1-log-in-to-the-google-credentials-page)
- [Step 2: Create a project](#step-2-create-a-project)
- [Step 3: Set up OAuth Consent Screen](#step-3-set-up-oauth-consent-screen)
- [Step 4: Getting the credentials](#step-4-getting-the-credentials)
- [Step 4: Placing the credentials into the project](#step-4-placing-the-credentials-into-the-project)
- [Step 5: Setting up the admins](#step-5-setting-up-the-admins)
- [Testing the project](#testing-the-project)

## Summary

This document will go over how to get the necessary API keys for the project. After getting the keys
it will show you where to put them.

## Step 1: Log in to the google credentials page

- Go to [Google Credentials Page](https://console.developers.google.com/apis/credentials) and sign in to your google account.

## Step 2: Create a project

- Once signed in click on create a project.
- Make a name for the project, select an organization if you want, and then click create.
- Once signed in click on create a project.

## Step 3: Set up OAuth Consent Screen

- On the left side bar click on `OAuth consent screen`
- Select internal or external based on your needs and hit create
- Fill out the information it asks for until you get to `Authorized domains`
- Once there you will want to add the domain of your website so it will work with google log in.
- Fill in your developer info and click save and continue
- You don't need and Scopes so you can click save and continue on the next screen
- For test users you can add yourself and anyone else who wants to be a test user
- -Click save and continue and the return to dashboard after you've confirmed all the data is correct

## Step 4: Getting the credentials

- On the left side bar click on `Credentials`
- At the top click create credentials
- Select `OAuth client ID`
- Select `Web application` from the drop down list
- Name it
- For `Authorized JavaScript origins` and `Authorized redirect URIs` you want to add the web address of your website (can also be localhost) to both of them or it won't work.
- Click on create
- You now have a client ID to use for the website, copy it
  
## Step 4: Placing the credentials into the project

- Navigate to `client\src\app\app.module.ts`
- Place the client ID in `provider: new GoogleLoginProvider` where a sample client ID is
- Now navigate to `server\src\main\java\umm3601\user`
- In the `GoogleIdTokenVerifier` method put your client Id where the sample client Id is.
- You are now ready to deploy the project!

## Step 5: Setting up the admins

- In the project we have set admins, you can become an admin by navigating to `database\seed\users.json`
- Once there you can change any of the admins who are already in it to be you, adminship is based off of your email so no other fields matter, but having a name you remember will help with organizing the context packs.
- The input that looks like
  `"_id": {"$oid": "606a5a9fd2b1da77da015c94"},`
  Needs to have an actual ObjectId for mongoDB so you can make one or use the ones already in the file.
- You can now seed the project in terminal by doing `cd database` then `.\mongoseed.bat` or `./mongoseed.sh` if you're on a mac

## Testing the project

- A separate set of credential keys should be made to to run the cypress tests, you don't want the client secret needed to run the tests to ever be public for your actual API.
- Make sure you make `https://developers.google.com/oauthplayground` an authorized redirect address in the setup
- Once you have you new API keys put them where you are supposed to in the code
- Now navigate to [Google OAuth playground](https://developers.google.com/oauthplayground/)
- Click the gear to the right  and then click `Use your own OAuth credentials` and fill in the API client and secret key information
- Under step 1 on the left find `Google OAuth2 API v2` and click it. Select all 3 options
- Authorize the APIs
- Click `Exchange authorization code for tokens`
- Get the refresh token and navigate to `client\cypress\support\add-contextpack.po.ts`
- Set the secret at the top to be the client secret.
- Go and input the refresh token and client ID wherever they are needed depending on whether or not the account you used to create the refresh token is an admin or not, you have to make two different refresh tokens one for an admin and one for a regular user.

