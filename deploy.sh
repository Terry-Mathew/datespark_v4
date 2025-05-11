#!/bin/bash

# Deploy Firebase Functions
echo "Deploying Firebase Functions..."
cd functions
npm run build
firebase deploy --only functions

# Return to root directory
cd ..

# Deploy Firestore security rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules

echo "Deployment completed!" 