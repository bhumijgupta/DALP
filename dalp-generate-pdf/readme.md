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
