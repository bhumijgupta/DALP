# DALP Generate PDF Azure Function

Azure Function to generate pdf from transcripts and screenshots, save it to Azure Blob storage and return the pdf URL.

## HTTP Trigger

- POST

## POST Request body parameters

JSON Object with the following key-value pairs

```javascript
{
    "transcripts" : string,
    "classID" : string,
    "screenshots" : [ images in base64 encoded string ]
}
```

## Response

JSON Object with the following key-value pairs

```javascript
{
    "type": "url" or "error",
    "data": string
}
```

## Testing function locally

```cmd
func host start
```
An endpoint will be output in the terminal which you can use for testing.

## Deploying function to Azure Functions
### Requirements
 - Azure subscription
 - Visual Studio Code (makes testing and deploying convenient)
 
Find tutorial to [Create and deploy serverless Azure Functions in Python with Visual Studio Code](https://docs.microsoft.com/en-us/azure/developer/python/tutorial-vs-code-serverless-python-01)
