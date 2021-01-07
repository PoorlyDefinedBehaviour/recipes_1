**How to run**

**With docker image** </br>
1- Run 
```
docker pull poorlydefinedbehaviour/recipes_1
```
2- Run 
```
docker run \
  -e PORT=7676 \
  -e RECIPE_API_URL=http://www.recipepuppy.com/api \
  -e GIF_API_URL=http://api.giphy.com/v1 \
  -e GIF_API_KEY=<your_giphy_api_key> \
  -p 7676:7676 \
   poorlydefinedbehaviour/recipes_1
```

</br>

**If your giphy api key is not working** </br>
1- Run 
```
docker pull poorlydefinedbehaviour/recipes_1
```
2- Run 
```
docker run \ 
  -e PORT=7676 \
  -e RECIPE_API_URL=http://www.recipepuppy.com/api \
  -e GIF_API_URL=http://api.giphy.com/v1 \
  -e GIF_API_KEY=any_value \
  -e DEBUG=true \
  -p 7676:7676 \
  poorlydefinedbehaviour/recipes_1
```

</br>

**With .env file** </br>
1- Copy `.env.testing` to a file called `.env` and replace the values</br>
2- Run `yarn start` or `npm start` </br>

</br>

**Running tests** </br>
1- Run
```
yarn test or npm test
```

Some tests may take long to execute because of the retry strategy.