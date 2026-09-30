echo "Creating zip for layer"
zip -r layer.zip nodejs

echo "Creating zip for GET Function"
cd LambdaFunctionsWithLayer/get
zip -r get.zip index.js
mv get.zip ../../
cd ../..

echo "Creating zip for POST Function"
cd LambdaFunctionsWithLayer/post
zip -r post.zip index.js
mv post.zip ../../
cd ../..

echo "Creating zip for UPDATE Function"
cd LambdaFunctionsWithLayer/update
zip -r update.zip index.js
mv update.zip ../../
cd ../..

echo "Creating zip for DELETE Function"
cd LambdaFunctionsWithLayer/delete
zip -r delete.zip index.js
mv delete.zip ../../
cd ../..
echo "Success!"