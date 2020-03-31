import logging
import json
import os
import base64
import azure.functions as func
from . import generate_pdf
from . import blob_storage


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    if req.method == "GET":
        return func.HttpResponse(
            json.dumps(
                {
                    "type": "error",
                    "data": "GET request not available. Trigger this function via POST request."
                }
            ),
            mimetype="application/json",
            status_code=400,
        )

    post_data = {}

    try:
        post_data = json.loads(req.get_body().decode())
    except Exception:
        return func.HttpResponse(
            json.dumps(
                {
                    "type": "error",
                    "data": "Please pass transcripts, classID and screenshots in the request body as JSON",
                }
            ),
            mimetype="application/json",
            status_code=400,
        )
    else:
        if not (
            "transcripts" in post_data
            and "classID" in post_data
        ):
            return func.HttpResponse(
                json.dumps(
                    {
                        "type": "error",
                        "data": "Please pass transcripts, classID and screenshots in the request body",
                    }
                ),
                mimetype="application/json",
                status_code=400,
            )
        else:
            try:
                transcripts = post_data["transcripts"]
                classID = post_data["classID"]

                if not transcripts or transcripts == "":
                    raise Exception("Transcripts cannot be empty.")

                if not classID or classID == "":
                    raise Exception("Class ID cannot be empty.")

                # screenshots = post_data["screenshots"]

                # save_screenshots(screenshots, classID)

                pdf_data = generate_pdf.generate(
                    transcripts.split("."), classID)

                # delete_screenshots(classID)

                resp = blob_storage.upload_blob_get_url(pdf_data, classID)

            except Exception as e:
                return func.HttpResponse(
                    json.dumps({"type": "error", "data": str(e)}), mimetype="application/json", status_code=400
                )
            else:
                return func.HttpResponse(
                    json.dumps(resp), mimetype="application/json", status_code=200
                )


# def save_screenshots(screenshots, classID):
#     for index, screenshot in enumerate(screenshots):
#         screenshot_bytes = screenshot.encode()

#         data_path = "data"
#         if not os.path.exists(data_path):
#             os.mkdir(data_path)
#         folder_path = os.path.join(data_path, classID.lower())
#         if not os.path.exists(folder_path):
#             os.mkdir(folder_path)
#         file_name = f"image_{str(index+1)}.png"
#         full_path = os.path.join(folder_path, file_name)
#         with open(full_path, "wb") as fh:
#             fh.write(base64.decodebytes(screenshot_bytes))


# def delete_screenshots(classID):
#     path = os.path.join("data", classID)
#     if os.path.exists(path):
#         for file_name in os.listdir(path):
#             os.remove(os.path.join(path, file_name))
#         os.rmdir(path)
