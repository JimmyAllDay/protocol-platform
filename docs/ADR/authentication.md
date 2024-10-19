# Authentication

This file sets out design decisions related to the authentication flow for this app.

As at the current version of this app, the app uses Firebase Auth for its authentication flow. After experimentation with other authentication solutions, this decision was made because it provides a balance of simplicity and integration with other firebase services the app uses. These services include user profile management, user uploads, and others.

This app has attempted to modularise the code for its authentication functions. The exception is an authentication state React 'subscription' component, which uses the native onAuthStateChanged Firebase method. All functions and the custom react hook are imported into a React context hook (context/AuthContext) to provide a consistent interface for use across the app, and to support an anticipated future change to a new authentication solution.

# Registration

New account registration proceeds in several stages:

1. A user authentication profile is created in firebase auth
2. A user profile is created in firebase firestore. This profile contains a range of properties the authentication profile does not
3. A user metrics object is created is firebase firestore. This object is to capture user activity of the app and includes, for example, user usage and security data, such as sign-in attempts without email verification, for rate limiting.
4. A user verification email is sent to the user's supplied email addresss.
5. The user is signed out.
6. The user must verify the email prior to being able to access the application.
7. Once verified the user can login.

This flow leads to the below possible outcomes for subsequent log in attempts. The accompanying decisions for addressing each outcome are as follows:

## Attempt to Sign In Without Registering

An error is returned to the user stating that the account does not exist

## Attempt to Sign In Without Email Verification

An verification email is automatically sent to the user's provided email address and instructions are provided to the user to verify, then attempt login. The number of sign in attemps without verification is rate limited to 3 per 24 hour period.

## Successful Sign In After Registering and Verifying Email

The user is redirected to the main page of the application.

## Forgot Password Before Email Verification

## Forgot Password After Email Verification

## Multiple Sign-Up Attempts With the Same Email Before Email Verification

## Multiple Sign-Up Attempts With the Same Email After Email Verification

## Email Change Request Before or after verification

This is not handled by the app.

## Account Deletion Request After Email Verification

Users can delete their account if they wish by going to the Account page.

## Attempting to Use the Verification Link After It Expires

## User Signs Up, Verifies, but Does Not Sign In for an Extended Period

No change to ordinary sign in flow

## Sign-In Attempts with Third-Party Providers Linked to an Unverified Email

## Reacting to Security Alerts or Suspicious Activity Before Email Verification:
