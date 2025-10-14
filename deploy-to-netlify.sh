#!/bin/bash

# 🚀 Simple Diary OAuth Server - Netlify Deployment Script

echo "🚀 Preparing Simple Diary OAuth Server for Netlify deployment..."

# Create a deployment package (excluding unnecessary files)
echo "📦 Creating deployment package..."

# Create a temporary directory for deployment
DEPLOY_DIR="netlify-deploy"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# Copy necessary files
cp -r api $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/
cp netlify.toml $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/

# Create a zip file for easy upload
cd $DEPLOY_DIR
zip -r ../simple-diary-oauth-netlify.zip .
cd ..

echo "✅ Deployment package created: simple-diary-oauth-netlify.zip"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://netlify.com"
echo "2. Drag and drop 'simple-diary-oauth-netlify.zip' onto the deploy area"
echo "3. Set environment variables in Netlify dashboard:"
echo "   - SUPABASE_URL=https://bqxypskdebsesfwpqrfv.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here"
echo "   - GOOGLE_CLIENT_ID=579431569676-53ejmft2l1hhe8g8mit1aqqtfe1hm9fl.apps.googleusercontent.com"
echo "   - GOOGLE_CLIENT_SECRET=your_google_client_secret_here"
echo "4. Update your mobile app with the Netlify URL"
echo ""
echo "📖 See NETLIFY_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "🎉 Ready to deploy!"
