#!/bin/bash
cd /home/kavia/workspace/code-generation/android-tv-react-native-app-333519-333533/android_tv_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

