// AWS Cognito Configuration
// Update these values with your Cognito User Pool details

export const cognitoConfig = {
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
  userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
}

// Initialize Amplify Auth (uncomment when ready to use)
// import { Amplify } from "@aws-amplify/core"
// import { Auth } from "@aws-amplify/auth"
// 
// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: cognitoConfig.userPoolId,
//       userPoolClientId: cognitoConfig.userPoolWebClientId,
//     },
//   },
// })

